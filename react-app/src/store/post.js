const GET_ALL_POSTS = 'posts/getAll'
const GET_ONE_POST = 'posts/getOne'
const GET_AUTHOR = 'posts/getAuthor'
const CREATE_POST = 'posts/Create'

const actionGetAllPosts =(allPosts) => ({
    type: GET_ALL_POSTS,
    allPosts
})

const actionGetOnePost = (singlePost) => ({
    type: GET_ONE_POST,
    singlePost
})

const actionGetAuthors = (authors) => ({
    type: GET_AUTHOR,
    authors
})

const actionCreatePost = (newPost) => ({
    type: CREATE_POST,
    newPost
})

export const getAllPosts = () => async dispatch => {
    const res = await fetch('/api/posts/all')

    if (res.ok) {
        // console.log('RES OK')
        const allPosts = await res.json()
        // console.log('allPosts', allPosts)
        dispatch(actionGetAllPosts(allPosts))
    }
}

export const getOnePost = (postId) => async dispatch => {
    const res = await fetch(`/api/posts/${postId}`)

    if (res.ok) {
        const singlePost = await res.json()
        dispatch(actionGetOnePost(singlePost))
    }
}

export const getAuthors = (authorIdArr) => async dispatch => {
    // console.log('AUTHOR THUNK HIT', authorIdArr)
    let resArr = []
    for (let i = 0; i < authorIdArr.length; i++) {
        const res = await fetch(`/api/posts/authors/${authorIdArr[i]}`)
        if (res.ok) {
            resArr.push(res)
        }
    }

    if (resArr.length) {
        let authors = []
        // console.log('AUTHOR RES OK')
        for (let author of resArr) {
            const authorJson = await author.json()
            authors.push(authorJson)
        }
        // console.log('RES ARR JSON', authors)
        dispatch(actionGetAuthors(authors))
    }
}

export const addImageToPost = (newPost, image) => async dispatch => {
    // console.log('ASSOCIATE IMAGE THUNK HIT')
    const res = await fetch(`/api/post_images/${newPost.id}/add_image`, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            'url': image
        })
    })

    if (res.ok) {
        // console.log('POST IMAGE RES OK')
        const newImage = await res.json()
        // console.log('NEW IMAGE', newImage)
        return newImage
    }
} 

export const createPost = (subcrudditId, header, body, image) => async dispatch => {
    // console.log('NEW POST THUNK HIT')
    let res;
    if (image) {
        // console.log('IN IMAGE CONDITIONAL')
        res = await fetch(`/api/posts/${subcrudditId}/new_post`, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                'header': header,
                'body': body
            })
        })

        if (res.ok) {
            const newPost = await res.json()
            // console.log('NEW POST', newPost)
            // const newPostWithImage= await dispatch(addImageToPost(newPost, image))
            await dispatch(addImageToPost(newPost, image))
            // console.log('NEW POST WITH IMAGE', newPostWithImage)
            dispatch(actionCreatePost(newPost))
            return newPost
        }
    } else {
        // console.log('IN ELSE STATEMENT')
        res = await fetch(`/api/posts/${subcrudditId}/new_post`, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                'header': header,
                'body': body
            })
        })
        
        if (res.ok) {
            const newPost = await res.json()
            dispatch(actionCreatePost(newPost))
            return newPost
        }
    }

}

let initialState = {
    allPosts: {},
    singlePost: {},
    newPost: {}
}
export default function postReducer(state=initialState, action) {
    switch (action.type) {
        case GET_ALL_POSTS: {
            // console.log('REDUCER')
            const newState = {...state, allPosts: {...state.allPosts}, singlePost: {...state.singlePost}}
            action.allPosts.map(post => newState.allPosts[post.id] = {...post})
            return newState
        }
        case GET_ONE_POST: {
            const newState2 = {...state, allPosts: {...state.allPosts}, singlePost: {...state.singlePost}}

            newState2.singlePost = {...action.singlePost}

            return newState2
        }
        case GET_AUTHOR: {
            const newState3 = {...state, allPosts: {...state.allPosts}, singlePost: {...state.singlePost}}

           newState3.authors = {}

           Object.values(action.authors).map(author => newState3.authors[author.id] = {...author})

            return newState3
        }
        case CREATE_POST: {
            const newState4 = {...state, allPosts: {...state.allPosts}, singlePost: {...state.singlePost}, newPost: {...state.newPost}}
        
            newState4.newPost = {...action.newPost}

            return newState4
        }
        default:
            return state
    }
}