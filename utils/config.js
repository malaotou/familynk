// module.exports={
//     api:{
//             host:'localhost',
//             port:'3000'
//         },
//     mongolink:{
//         host:"mongodb://familyadmin:familyadmin@ds046667.mlab.com:46667/familynk"
//     },
//     we:{
//             appid:'wx08ddb6c48e71ce06',
//             secret:'f3f1c8811efdbbadd4c176de5798da66',
//             grant_type:'authorization_code',
//     },
//     file:{
//         path:'c:/family',
//         rooturl:"http://localhost:3000/file/"
//     }
// }

module.exports={
    api:{
            host:'0.0.0.0',
            port:'3000'
        },
    mongolink:{
        host:"mongodb://familyadmin:familyadmin@ds046667.mlab.com:46667/familynk"
    },
    we:{
            appid:'wx08ddb6c48e71ce06',
            secret:'f3f1c8811efdbbadd4c176de5798da66',
            grant_type:'authorization_code',
    },
    file:{
        path:'/home/familyimg/',
        rooturl:"https://orangeexperience.com/file/"
    }
}