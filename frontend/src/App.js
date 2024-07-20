import './App.css';
import React, {useState, useEffect} from 'react'
import Note from './notes.js'

const baseUrl = 'http://54.218.120.170:8000'

function App() {
const [modalVisible,setModalVisible] = useState(false)
const [title,setTitle] = useState('')
const [content,setContent] = useState('')
const [posts,setPosts] = useState([])

const createNote = async (event) =>{
  event.preventDefault()
  
  const new_request = new Request(
    `${baseUrl}/posts/`,{
      body:JSON.stringify({title,content}),
      headers:{
        'Content-Type':'Application/Json'
      },
      method:'POST'
    }
  )

  const response = await fetch(new_request)

  const data = await response.json()

  if(response.ok){
    console.log(data)
    setPosts(data)
  }
  else{
    console.log("Network request failed")
  }

  console.log(title);
  console.log(content);

  setTitle('')
  setContent('')
  setModalVisible(false)
  getAllPosts();
}

const getAllPosts = async() =>{
  const response = await fetch(`${baseUrl}/posts/`)

  const data = await response.json()

  if(response.ok){
    console.log(data)
    setPosts(data)
  }
  else{
    console.log("Network request failed")
  }
}

useEffect(
  ()=>{
    getAllPosts()
  },[]
)

const deleteItem = async (noteId)=>{
 console.log(noteId)

 const response = await fetch(`${baseUrl}/posts/${noteId}/`,{
  method:'DELETE'
 })

 if(response.ok){
  console.log(response.status)
 }

 getAllPosts()
}
  return (
    <div>
      <div className="header">
        <div className="logo">
          <p className="title">Guest Book</p>
        </div>
        <div className="add-section">
          <a className="add-btn" href='#' onClick={()=>setModalVisible(true)}>Add Note</a>
        </div>
      </div>

      {posts.length>0?
      (<div className="post-list">
        {
          posts.map(
            (item) => (
              <Note title={item.title} content={item.content} onclick={()=>deleteItem(item.id)} key={item.id}/>
            )
          )
        }
      </div>):(
        <div className="posts">
          <p className="centerText">No posts</p>
        </div>
      )
      }

      <div className={modalVisible? 'modal' : 'modal-not-visible'}>
        <div className="form">
          <div className="form-header">
            <div>
              <p className="form-header-text">Create a Note</p>
            </div>
            <div>
              <a href="#" className='close-btn'
              onClick={()=>setModalVisible(!modalVisible)}>X</a>
            </div>
          </div>

          <form action="">
            <div className="form-group">
              <label forname="title">Title</label>
              <input type="text" name="title" id="title" className="form-control" 
              value={title} onChange={(e)=>setTitle(e.target.value)} required/>
            </div>
            <div className="form-group">
              <label forname="content">Content</label>
              <textarea name="content" id="" cols="30" rows="5" className="form-control"
              value={content} onChange={(e)=>setContent(e.target.value)} required></textarea>
            </div>
            <div className="form-group">
              <input type="submit" value="Save" className='btn' onClick={createNote}/>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
