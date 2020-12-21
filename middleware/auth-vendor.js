export default async function({$auth, redirect}) {
    let user = $auth.$state.user;
    if(user && user.is_vendor) {
    
    } else {
        redirect('/')        
    }

    // const blockedRoute = /\/vendor\/*/g;
    // if (!user.is_vendor && route.path.match(blockedRoute)) {
    //     redirect('/')
    // }
}