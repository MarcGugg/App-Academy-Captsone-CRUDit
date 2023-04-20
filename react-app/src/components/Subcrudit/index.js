import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { NavLink, useParams } from 'react-router-dom'
import { getOneSub } from '../../store/subcrudit'
import { getAuthors } from '../../store/post'
import { getPostImages } from '../../store/post_image'

function Subcrudit() {

    const dispatch = useDispatch()
    const {subcruditId} = useParams()

    useEffect(async () => {
        await dispatch(getOneSub(subcruditId))
    }, [dispatch])

    const sub = useSelector((state) => state.subcrudits.oneSubcrudit)
    
    useEffect(async () => {
        if (Object.values(sub).length) {
            // for (let id in authorIdArr) {
            //     console.log('id in useEffect', id)
            //     let author = await dispatch(getAuthors(authorIdArr[id]))
            //     console.log('one author', author)
            //     authors.push(author)
            // }
            await dispatch(getAuthors(authorIdArr))
            await dispatch(getPostImages(postIdArr))
        }
    }, [sub, dispatch])

    const authors = useSelector((state) => state.posts.authors)
    const postImages = useSelector((state) => state.postImages.imagesByPost)
    console.log('authors from state', authors)
    console.log('post images from state', postImages)
    console.log('sub', sub)
    console.log('posts', sub.posts)

    const authorIdArr = []
    const postIdArr = []
    for (let key in sub.posts) {
        authorIdArr.push(sub.posts[key].authorId)
        postIdArr.push(key)
    }
    console.log('postIdArr', postIdArr)

    // let authors = []

    // console.log('AUTHOR IDS', authorIdArr)
    // console.log('AUTHORS', authors)

    if (!Object.values(sub).length || !sub || !authors || !Object.values(authors).length) {
        return null
    }

    // if (postImages && !Object.values(postImages).length) {
    //     return null
    // }


    return (
        <>
        <h1>Subcrudit page</h1>
        <div>
            <h1>{sub.name}</h1>
            <h2>{sub.description}</h2>
        </div>
        <div>{Object.values(sub.posts).map(post => (
                        <NavLink to={`/posts/${post.id}`}>
                        <div>
                            <p>{authors[post.authorId]?.username} </p>
                            {/* {post.authorId} */}
                            <h1>{post.header}</h1>
                        {postImages ? 
                            <div className='images'>
                                    <img src={postImages[post.id]?.url} style={{height:50}} />
                                    {/* // <h2>Hello</h2>
                                    // <p>{postImages[9].url}</p> */}
                            </div>
                        : ''}
                            <div>
                                {post.body}
                            </div>
                        </div>
                        </NavLink>
        ))}</div>
        </>
    )
}

export default Subcrudit