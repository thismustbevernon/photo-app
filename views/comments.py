from flask import Response, request
from flask_restful import Resource
import json
from models import db, Comment, Post
from views import get_authorized_user_ids

class CommentListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def post(self):
        # create a new "Comment" based on the data posted in the body 
        body = request.get_json()
        post_id = body.get('post_id')

        try: post_id = int(post_id)
        except: return Response(json.dumps({"message": "invalid post id format."}), mimetype="application/json", status=400)
        
        #if not post_id: return Response(json.dumps({"message": "'image_url' is required."}), mimetype="application/json", status=400)

        # get all posts
        posts= Post.query.all()
        post_ids = [post.id for post in posts]
        if post_id not in post_ids:
            return Response(json.dumps({"message": "invalid post id."}), mimetype="application/json", status=404)

        user_ids = get_authorized_user_ids(self.current_user)

        post = Post.query.get(post_id)
        if post.user_id not in user_ids:
            return Response(json.dumps({"message": "unauthorized post id."}), mimetype="application/json", status=404)

        text = body.get('text')
        if not text:
            return Response(json.dumps({"message": "missing text."}), mimetype="application/json", status=400)

        # 1. Create:
        try: 
            new_comment = Comment(
                #image_url=body.get('image_url'),
                text=text,
                user_id=self.current_user.id, # must be a valid user_id or will throw an error
                post_id=post_id,
                #alt_text=body.get('alt_text')
            )
            db.session.add(new_comment)    # issues the insert statement
            db.session.commit()         # commits the change to the database 
        except:
            return Response(json.dumps({"message": "duplicate like."}), mimetype="application/json", status=400)


        return Response(json.dumps(new_comment.to_dict()), mimetype="application/json", status=201)
        
class CommentDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
  
    def delete(self, id):
        # delete "Comment" record where "id"=id
        print(id)
        
        comment = Comment.query.get(id)
        if not comment: return Response(json.dumps({"message": "id={0} is invalid".format(id)}), mimetype="application/json", status=404)
        if comment.user_id != self.current_user.id: return Response(json.dumps({"message": "id={0} is invalid".format(id)}), mimetype="application/json", status=404)
        Comment.query.filter_by(id=id).delete()
        db.session.commit()
        return Response(json.dumps({"message": "Post id={0} was successfully deleted.".format(id)}), mimetype="application/json", status=200)
        


def initialize_routes(api):
    api.add_resource(
        CommentListEndpoint, 
        '/api/comments', 
        '/api/comments/',
        resource_class_kwargs={'current_user': api.app.current_user}

    )
    api.add_resource(
        CommentDetailEndpoint, 
        '/api/comments/<int:id>', 
        '/api/comments/<int:id>/',
        resource_class_kwargs={'current_user': api.app.current_user}
    )
