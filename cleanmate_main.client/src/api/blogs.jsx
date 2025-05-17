// images
import blogImg1 from "../images/blog/img-1.jpg";
import blogImg2 from "../images/blog/img-2.jpg";
import blogImg3 from "../images/blog/img-3.jpg";
import blogImg4 from "../images/blog/img-7.jpg";

import blogAvaterImg1 from "../images/blog/blog-avater/img-1.jpg";
import blogAvaterImg2 from "../images/blog/blog-avater/img-2.jpg";
import blogAvaterImg3 from "../images/blog/blog-avater/img-3.jpg";

import blogSingleImg1 from "../images/blog/img-4.jpg";
import blogSingleImg2 from "../images/blog/img-5.jpg";
import blogSingleImg3 from "../images/blog/img-6.jpg";
import blogSingleImg4 from "../images/blog/img-8.jpg";



const blogs = [
    {
        id: '1',
        title: 'The Science of Spring Cleaning!',
        screens: blogImg1,
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet autem beatae errodio.',
        author: 'Jenefer Willy',
        authorTitle:'Cleaner Leader',
        authorImg:blogAvaterImg1,
        create_at: '14 AUG,22',
        blogSingleImg:blogSingleImg1, 
        comment:'5,975',
        blClass:'format-standard-image',
    },
    {
        id: '2',
        title: 'Save Money on Cleaning Supplies',
        screens: blogImg2,
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet autem beatae errodio.',
        author: 'Konal Biry',
        authorTitle:'Cleaner Leader',
        authorImg:blogAvaterImg2,
        create_at: '16 AUG,22',
        blogSingleImg:blogSingleImg2, 
        comment:'7,275',
        blClass:'format-standard-image',
    },
    {
        id: '3',
        title: '10 House Cleaners near Los Angeles',
        screens: blogImg3,
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet autem beatae errodio.',
        author: 'Jenefer Willy',
        authorTitle:'Cleaner Leader',
        authorImg:blogAvaterImg3,
        create_at: '18 AUG,22',
        blogSingleImg:blogSingleImg3,
        comment:'6,725',
        blClass:'format-standard-image',
    },
    {
        id: '4',
        title: 'A day in the life of a cleaning business',
        screens: blogImg4,
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet autem beatae errodio.',
        author: 'Jenefer Willy',
        authorTitle:'Cleaner Leader',
        authorImg:blogAvaterImg3,
        create_at: '18 AUG,22',
        blogSingleImg:blogSingleImg4,
        comment:'6,725',
        blClass:'format-video',
    },
];
export default blogs;