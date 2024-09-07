const loginBtn = document.querySelector('.login--btn');
const email = document.querySelector('#email');
const password = document.querySelector('#password');


function Alert(type,msg) {
    const div = document.createElement('div');
    div.classList.add(`${type}-alert`);
    if(type==='success')
        div.classList.add(`white-pg`);
    div.textContent = msg;
    document.body.appendChild(div);
    setTimeout(()=>{
        div.remove();
        if(type==='success')
            window.location.href='admin'
        else
            window.location.href='index.html'
    },2000)
}

if(loginBtn){
    loginBtn.addEventListener('click',async (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log({
            email:email.value,
            password:password.value,
        })
        const url = 'api/v1/users/login';

        try{
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email.value,
                    password: password.value,
                })
            });
            const responseData = await response.json();
            console.log(responseData)
            if(!response.ok) {
                console.log(responseData)
                Alert('error', responseData.message);
            }
            else
                Alert('success','Logged in successfully')
        }catch (error){
            console.log(error)
            Alert('error',error.message);

        }

    })
}
