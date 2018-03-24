import React from 'react'
import { connect } from "react-redux"
import { getArticleData } from "../../redux/article.redux"

@connect(
  state => state.article,
  { getArticleData }
)
class Index extends React.Component{
  componentDidMount(){
    this.props.getArticleData()
  }
  render(){
    console.log(this.props)
    return(
      <div>index</div>
    )
  }
}

export default Index