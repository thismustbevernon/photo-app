from flask import Response, request
from flask_restful import Resource
from models import Following, db
import json

def get_path():
    return request.host_url + 'api/posts/'

class FollowerListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    def get(self):
        '''
        People who are following the current user.
        In other words, select user_id where following_id = current_user.id
        '''
        # follower_tuples  = (
        #     db.session
        #         .query(Following.following_id)
        #         .filter(Following.user_id == self.current_user.id)
        #         .order_by(Following.following_id)
        #         .all()
        # )

        # follower_ids = [id for (id,) in follower_tuples]

        # follower_ids.append(self.current_user.id)

        # followers= Following.query.filter(Following.user_id.in_(follower_ids)).all()
        # followers_json = [follower for follower in followers]
        # return Response(json.dumps(followers_json), mimetype="application/json", status=200)

        followers = (
            Following
                .query
                .filter(Following.following_id == self.current_user.id)
                .order_by(Following.following_id)
                .all()
        )
        print(followers)

        follower_json = [follower.to_dict_follower() for follower in followers]

        return Response(json.dumps(follower_json), mimetype="application/json", status=200)




def initialize_routes(api):
    api.add_resource(
        FollowerListEndpoint, 
        '/api/followers', 
        '/api/followers/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
