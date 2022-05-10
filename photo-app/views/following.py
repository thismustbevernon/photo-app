from flask import Response, request
from flask_restful import Resource
from models import Following, User, db
import json
from views import get_authorized_user_ids

def get_path():
    return request.host_url + 'api/posts/'

class FollowingListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    def get(self):
        # return all of the "following" records that the current user is following
        followers = (
            Following
                .query
                .filter(Following.user_id == self.current_user.id)
                .order_by(Following.following_id)
                .all()
        )
        print(followers)

        follower_json = [follower.to_dict_following() for follower in followers]

        return Response(json.dumps(follower_json), mimetype="application/json", status=200)


    def post(self):
        # create a new "following" record based on the data posted in the body 
        body = request.get_json()
        user_id = body.get('user_id')

        try: user_id = int(user_id)
        except: return Response(json.dumps({"message": "invalid post id format."}), mimetype="application/json", status=400)
        
        #if not post_id: return Response(json.dumps({"message": "'image_url' is required."}), mimetype="application/json", status=400)

        # get all users
        # users= User.query.all()
        # user_ids = [user.id for user in users]
        # if user_id not in user_ids:
        #     return Response(json.dumps({"message": "invalid post id."}), mimetype="application/json", status=404)

        user = User.query.get(user_id)
        if not user:
            return Response(json.dumps({"message": "invalid post id."}), mimetype="application/json", status=404)

        # user_ids = get_authorized_user_ids(self.current_user)

        # post = Post.query.get(user_id)
        # if post.user_id not in user_ids:
        #     return Response(json.dumps({"message": "unauthorized post id."}), mimetype="application/json", status=404)


        #print("jininvirehnw")
        # 1. Create:
        try: 
            new_following = Following(
                #image_url=body.get('image_url'),
                user_id=self.current_user.id, # must be a valid user_id or will throw an error
                following_id=user_id,
                #alt_text=body.get('alt_text')
            )
            db.session.add(new_following)    # issues the insert statement
            db.session.commit()         # commits the change to the database 
        except:
            return Response(json.dumps({"message": "duplicate like."}), mimetype="application/json", status=400)


        return Response(json.dumps(new_following.to_dict_following()), mimetype="application/json", status=201)

class FollowingDetailEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    def delete(self, id):
        # delete "following" record where "id"=id
        print(id)
        following = Following.query.get(id)
        if not following: return Response(json.dumps({"message": "id={0} is invalid".format(id)}), mimetype="application/json", status=404)
        if following.user_id != self.current_user.id: return Response(json.dumps({"message": "id={0} is invalid".format(id)}), mimetype="application/json", status=404)
        Following.query.filter_by(id=id).delete()
        db.session.commit()
        return Response(json.dumps({"message": "Post id={0} was successfully deleted.".format(id)}), mimetype="application/json", status=200)




def initialize_routes(api):
    api.add_resource(
        FollowingListEndpoint, 
        '/api/following', 
        '/api/following/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
    api.add_resource(
        FollowingDetailEndpoint, 
        '/api/following/<int:id>', 
        '/api/following/<int:id>/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
