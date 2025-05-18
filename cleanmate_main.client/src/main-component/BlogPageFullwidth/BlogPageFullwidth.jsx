import React, {Fragment} from 'react';
import Navbar from '../../components/Navbar/Navbar'
import PageTitle from '../../components/pagetitle/PageTitle'
import BlogList from '../../components/BlogList/BlogList'
import Footer from '../../components/footer/Footer'
import Scrollbar from '../../components/scrollbar/scrollbar'
import Logo from '../../images/logo.svg'

const BlogPageFullwidth =() => {
    return(
        <Fragment>
            <Navbar Logo={Logo}/>
            <PageTitle pageTitle={'Tin mới nhất'} pagesub={'Blog'}/> 
            <BlogList blLeft={'d-none'} blRight={'col-lg-10 offset-lg-1'}/>
            <Footer/>
            <Scrollbar/>
        </Fragment>
    )
};
export default BlogPageFullwidth;

