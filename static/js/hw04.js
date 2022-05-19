
const story2Html = story => { // map invokes this fxn on each item on the list 1x1. so takes each story obj as an arg and generates this html rep of that story
    return `
    <div class="each-story">
        <img class="suggestion-imgs story-images" alt="profile pic for ${ story.user.username }" src="${story.user.thumb_url }">
        <span class="story-name">${story.user.username}</span>
    </div>
    `; //  img and pargrph taken from data instead of being hardcoded
};

const handleLike = ev => { // create fxns to handle what we want to happen when someone likes/bookmarks
    const elem = ev.currentTarget // wanna know the btn the user just clicked . but we can get the info from the ev handler
    console.log("Handle like functionality");
    // aria-checked == true, delete the like. if its liked, unlike it
    if (elem.getAttribute('aria-checked')=== 'true'){
        unlikePost(elem);
    }else{ // otherwise, like it. so issue a post request to create a like object
        likePost(elem);
    }
 }; // after everything is done, redraw post to reflect its new status
 

const unlikePost = elem => {
    const postId =  Number(elem.dataset.postId)
    console.log('unlike post', elem);
    //added two lines bellow
    const postData = {
        "post_id": postId
    };
    fetch(`/api/posts/likes/${elem.dataset.likeId}`,{
        method:"DELETE",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
    })
    .then(response => response.json())
    .then(data=> {
        console.log(data);
        console.log('redraw the posr');
        redrawPost(postId);
        //redraw the post
    });
 };
 

 const likePost = elem => {
    const postId =  Number(elem.dataset.postId)
    console.log('like post', elem);
    const postData = {
        "post_id": postId
    };
    fetch("/api/posts/likes/",{
        method:"POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
    })
    .then(response => response.json())
    .then(data=> {
        console.log(data);
        redrawPost(postId);
        //redraw the post
    });
 };
 

const stringToHTML = htmlString =>{
    var parser = new DOMParser();
    var doc = parser.parseFromString(htmlString, 'text/html');
    return doc.body.firstChild
 };
 

const redrawPost = (postId, callback) => {
    fetch(`/api/posts/${postId}`)
        .then(response => response.json())
        .then(updatedPost =>{
            // console.log(updatedPost);
            // const html = post2Html(updatedPost);
            // const newElement = stringToHTML(html);
            // const postElement = document.querySelector(`#post_${postId}`);
            // postElement.innerHTML = newElement.innerHTML;
            // //postElement.innerHTML = html;
            if (!callback) {
                redrawCard(updatedPost);
            } else {
                callback(updatedPost);
            }
        });
  
 };
 
const redrawCard = post => {
    console.log(post);
    const html = post2Html(post);
    const newElement = stringToHTML(html);
    const postElement = document.querySelector(`#post_${post.id}`);
    console.log(newElement.innerHTML);
    postElement.innerHTML = newElement.innerHTML;
    //postElement.innerHTML = html;
};
 

const handleBookmark = ev => {
    console.log("Handle bookmark functionality");
    const elem = ev.currentTarget
    console.log("Handle like functionality");
  
    if (elem.getAttribute('aria-checked')=== 'true'){
        unbookmarkPost(elem);
    }else{
        bookmarkPost(elem);
    };
 };
 

const unbookmarkPost = elem => {
    
    const postId =  Number(elem.dataset.postId);
    console.log('unbookmark post', elem);
   
    //added two lines bellow
    // const postData = {
    //     "post_id": postId
    // };
    fetch(`/api/bookmarks/${elem.dataset.bookmarkId}`,{
        method:"DELETE",
        headers: {
            'Content-Type': 'application/json',
        }
        //body: JSON.stringify(postData)
    })
    .then(response => response.json())
    .then(data=> {
        console.log(data);
        console.log('redraw the post');
        redrawPost(postId);
        //redraw the post
    });
 };
 const bookmarkPost = elem => {
    
    const postId =  Number(elem.dataset.postId);
    console.log('bookmark post', elem);
    const postData = {
        "post_id": postId
    };
    fetch("/api/bookmarks/",{
        method:"POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
    })
    .then(response => response.json())
    .then(data=> {
        console.log(data);
        redrawPost(postId);
        //redraw the post
    });
 };
 // everything comments//////////////////////////////////////////////////////////

 const addComment = ev => {
    const elem = ev.currentTarget;
    let inputElement = elem;
    console.log(inputElement);
    ev.preventDefault();

    if (elem.tagName.toUpperCase() === 'INPUT') {
        if (ev.keyCode !== KeyCodes.RETURN) {
            return;
        }
    } else {
        // it's a button:
        inputElement = elem.previousElementSibling.querySelector('input');
    }
    const comment = inputElement.value;
    if (comment.length === 0) {
        return;
    }
    const postId = inputElement.dataset.postId;
    console.log("pi: ", elem.dataset.postId)
    console.log("pi: ", postId)

    const postData = {
        "post_id": postId,
        "text": comment
    };
    console.log("this is post data",postData);
    
    fetch("/api/comments", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(comment => {
            redrawPost(comment.post_id)
          
        });
};




/*
 const renderAddedComment = post => {
        return `
            <button 
                data-post-id = "${post.id}"
                onclick="addComment(event);"
                aria-label="post" 
                class="post-btn comment-background">
                <span class="comment-background">Post</span>
            </button>
        `;
};


 const addComment = ev => {
    const elem = ev.currentTarget;
    console.log('elem', elem.dataset);
    
    const postId = elem.dataset.postId;
    console.log('id', elem.dataset.postId);
    console.log('adding comment', elem.value);
    const postData = {
        "post_id": postId,
        "text":elem.value
    };
    console.log('pd', postData);
    fetch("/api/comments/",{
        method:"POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
    })
    .then(response => response.json())
    .then(data=> {
        console.log(data);
        redrawPost(postId);
      
        //redraw the post
    });
    
 };


 const handleComment = ev => {
    console.log("Handle comment functionality");
    const elem = ev.currentTarget
    console.log("Handle comment functionality");
 };
 
*/

 // everything comments

const handleShare = ev => {
    console.log("Handle share functionality");
};
/*
const handleComment = ev => {
    console.log("Handle comment functionality");
};
*/

const renderLikeButton = post => {
    if (post.current_user_like_id) {
        return `
            <button 
                data-post-id = "${post.id}"
                data-like-id = "${post.current_user_like_id}"
                onclick="handleLike(event);"
                class="other-icons" 
                type="button" 
                aria-label="like/unlike"
                aria-checked="true">
                <i class='fas fa-heart other-icons'></i>
            </button>
        `;
    } else {
        return `
            <button 
                data-post-id = "${post.id}"
                onclick="handleLike(event);"
                class="other-icons" 
                type="button" 
                aria-label="like/unlike"
                aria-checked="false">
                <i class='far fa-heart other-icons'></i>
            </button>
        `;
    }
};

const renderBookmarkButton = post => {
    if (post.current_user_bookmark_id) {
        return `
            <button 
                data-bookmark-id = "${post.current_user_bookmark_id}"
                data-post-id = "${post.id}"
                data-like-id = "${post.current_user_like_id}"
                onclick="handleBookmark(event);"
                class="other-icons" 
                type="button" 
                aria-label="bookmark/unbookmark"
                aria-checked="true">
                <i class='fas fa-bookmark other-icons'></i>
            </button>
        `;
    } else {
        return `
            <button 
                data-post-id = "${post.id}"
                onclick="handleBookmark(event);"
                class="other-icons" 
                type="button" 
                aria-label="bookmark/unbookmark"
                aria-checked="false">
                <i class='far fa-bookmark other-icons'></i>
            </button>
        `;
    }
};

const post2Html = post => { // takes data rep of a post as an arg and rets an html rep of the post. just moves some html into some js. takees a json post dump and creates an html from it
    // use ${} to embed an expr into a template. then just fig out the thing u want to refer to
    return `
    <div id="post_${post.id}" class="post" >  
        <div class="name-and-ellipse">
            <span class="post-name">${post.user.username}</span>
            
            <span class="ellipse">...</span>
        </div>
        <img class="post-image" alt="post for ${post.user.username }" src="${post.image_url}">
        <div class="icons">
            
            <span class="other-icons">
                
                ${renderLikeButton(post)}    
                <button 
                    onclick="handleComment(event);"
                    class="other-icons" 
                    type="button" 
                    aria-label="comment"><i class='far fa-comment other-icons'></i>
                </button>
                <button 
                    onclick="handleShare(event);"
                    class="other-icons" 
                    type="button" 
                    aria-label="share"><i class='far fa-paper-plane other-icons'></i>
                </button>
                
            </span>
            <span class="bookmark">   
                ${renderBookmarkButton(post)} 
            </span>
        </div>
        <span class="likes">${post.likes.length} likes</span>
        <div class="caption-and-comments"> 
            <p class="comment-background"><strong class="comment-background">${post.user.username}</strong>
            ${post.caption}...<span class="comment-background" style="color:blue">more</span></p>
           
            

            ${displayComments(post)}

            <span class="comment-background" style="color:black;font-size: 1em;"> ${post.display_time}</span>

            
            
            
        </div>
            <hr class="comment-background" style="width:100%">
        <div class="post-comments"> 
            <i style="margin:10px" class="far fa-smile comment-background"></i>
            <span class="comment-background" style="color:black;font-size: 0.9em;">
                <input data-post-id="${post.id}" type="text" placeholder="Add a comment...">
            </span>
            <button 
            
                onclick="addComment(event);"
                aria-label="post" 
                class="post-btn comment-background">
                <span class="comment-background">Post</span>
                
            </button>
         </div>
    </div>
    `; // creating the like and comment button and wanting them to do sth and attach the ev handlers to the temp
    // so bothe viewing and interacting with the posts
        
};

// fetch data from your API endpoint:
const displayStories = () => {
    fetch('/api/stories') // so we fetch api/stories
        .then(response => response.json())
        .then(stories => {
            console.log(stories); // data that comes from the internet. the json dump
            const html = stories.map(story2Html).join('\n'); // uses map to convert every elt of the list to an html repstn. rets a list of html strs that rep each story that have a pic, label. then we join our list to have a single str
            document.querySelector('.story-items').innerHTML = html; // then we inject the html str into the doc. output it at the class stories
        })
};



const displayPosts = () => {
    fetch('/api/posts') // querries the post end pt
        .then(response => response.json())
        .then(posts => { // as a rslt, gets a list of posts
            console.log(posts);
            const html = posts.map(post2Html).join('\n'); // and for each post, convert it to an html
            document.querySelector('.card-items').innerHTML = html; // and you output it at the id post
        })
};

const displayComments = post => {
    if (post.comments.length > 1) {
        // display a button
        return `
        <button 
            data-post-id=${post.id}
            onclick = "showModal(event)"
            class="view-comments">View all ${post.comments.length} comments
        </button>
        `
    } else if (post.comments.length == 1) {
        // display single comment
        return `
        <p class="comment-background"><strong class="comment-background">${post.comments[0].user.username}</strong>
            ${post.comments[0].text}
        </p>
        `
    } else {
        return '';
    }
};

const showModal = ev => {
    
    const postId = Number(ev.currentTarget.dataset.postId);
    redrawPost(postId, post => {
        const html = post2Modal (post);
        document.querySelector(`#post_${post.id}`).insertAdjacentHTML('beforeend', html);
    })
    
}
/*
const addComment = ev => {
    console.log("Add comment...");
};
*/

const post2Modal = post => {
    console.log('open modal!');
    
    return `
    <div class="modal-bg" aria-hidden="false" role="dialog">
       
        <button class="close" aria-label="Close the modal window" onclick="closeModal(event);">Close</button>
        <section class="modal">
            <div modal-pic>
                <img  class="modal-image" src="${post.image_url}">
            <img src="${post.user.thumb_url}"> 
            <p> ${post.user.username}</p>
            </div>

           
            <section class = "modal-comments">
            ${post.comments.map(comment => {return `
            <p class="comment-background"><img src= ${comment.user.thumb_url}> <strong class="comment-background">${comment.user.username}</strong>
                ${comment.text}
            </p>
                ${comment.display_time}
            `})}
            </section>
        </section>
    </div>
    `
};

const closeModal = ev => {
    console.log('close modal!');
    document.querySelector('.modal-bg').remove();
 }
 

const toggleFollow = ev => {
    //console.log(ev);
    const elem = ev.currentTarget;
    // console.log(elem.dataset);
    // console.log(elem.dataset.userId);
    // console.log(elem.innerHTML);

     //if (elem.innerHTML === 'follow') {
    if (elem.getAttribute('aria-checked') === 'false') {
         // issue post request
         followerUser(elem.dataset.userId, elem);
     } else {
         // issue delete request
         unfollowerUser(elem.dataset.followingId, elem);
     }
    //     elem.innerHTML = 'unfollow';
    //     elem.classList.add('unfollow');
    //     elem.classList.remove('follow');
    // } else {
    //     elem.innerHTML = 'follow';
    //     elem.classList.add('follow');
    //     elem.classList.remove('unfollow');
    // }
};

const followerUser = (userId, elem) => {
    const postData = {
        "user_id": userId
    };
    
    fetch("/api/following/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            elem.innerHTML = 'unfollow';
            elem.setAttribute('aria-checked', true);
            // aria-label="Follow"
            // aria-checked="false"
            elem.classList.add('unfollow');
            elem.classList.remove('follow');
            // in the event that we want to unfollow
            elem.setAttribute('data-following-id', data.id);
        });
};

const unfollowerUser = (followingId, elem) => {
    // issue a delete request
    const deleteURL = `/api/following/${followingId}`; 
    fetch(deleteURL, {
        method: "DELETE",
        
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        elem.innerHTML = 'follow';
        elem.classList.add('follow');
        elem.classList.remove('unfollow');
        elem.removeAttribute('data-following-id');
        elem.setAttribute('aria-checked', false);
    });

};

const user2Html = user => {
    return `
        
        <div class="suggested-profile">
            <span><img class="suggestion-imgs" alt="profile pic for ${user.username}" image" src="${user.thumb_url}" ></span>
            <div class="name-and-suggestion">
                            <span class="suggested-name">${user.username}</span>
        
                            <span class="suggested-for-you">suggested for you</span>
            </div>
        
            <span 
                <button 
                        class = "follow" 
                        aria-label="Follow"
                        aria-checked="false"
                        data-user-id="${user.id}" 
                        onclick="toggleFollow(event);">follow
                </button>
            </span>
        </div>
    `;
};

const getSuggestions = () => {
    fetch('/api/suggestions/')
        .then(response => response.json())
        .then(users => {
            console.log(users);
            const html = users.map(user2Html).join('\n'); // for each user in the users array, its going to apply this func and ret a brand new array of the text
            document.querySelector('.suggestion-profiles').innerHTML = html;
        });
};


const initPage = () => {
    displayStories(); // disp stories goes out to a working end pt to get the stories/retrieve them
    displayPosts(); // and then disp posts does same for posts. invoke it on page load
    getSuggestions(); // disp suggestions
};

const getComments = post => {
    if (post.comments.length > 1) {
        return `
        <button class="view-comments">View all ${post.comments.length} comments</button>
        <p class="comment-background"><strong class="comment-background">${post.comments[0].user.username}</strong>
            ${post.comments[0].text}</p>
        <span class="comment-background" style="color:black;font-size: 1em;"> ${post.comments[0].display_time}</span>
        
        `
    }
    if (post.comments.length >= 1) {
        return `
        <p class="comment-background"><strong class="comment-background">${post.comments[0].user.username}</strong>
            ${post.comments[0].text}</p>
        <span class="comment-background" style="color:black;font-size: 1em;"> ${post.comments[0].display_time}</span>
        `
    }
}

// invoke init page to display stories:
initPage(); // this function is invoked on page load. the second the entire page loads, this fxn fires and calls display stories