$(document).ready(function () {
    $('#datatable').DataTable();
});

function blockUser(id) {
    const data = document.getElementById(id).dataset.url;
    console.log(data);
    const url = "http://localhost:3000/admin/userdata/" + data;
    const body = {
        id: data
    }
    fetch(url, {
        method: 'put',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({ body })
    }).then((response) => response.json())
        .then((response) => {
            if (response.successStatus) {
                window.location.href = response.redirect
            } else {
                document.querySelector('#error').innerHTML = "An error has occured please try again"
            }
        }).catch((err) => console.log(err))
}

function deleteCategory(id){
    const data = document.getElementById(id).dataset.url;
    const url = "http://localhost:3000/admin/categories/" +data;
    const body ={
        id:data
    }
    fetch(url,{
        method:'PATCH',
        headers :{
            'Content-Type' : 'application/json'
        },
        body:JSON.stringify({body})
    }).then((response)=> response.json())
    .then((response)=>{
        if(response.successStatus){
            window.location.href=response.redirect
        }
        else{
            document.querySelector('#error').innerHTML = "An error occured please try again"
        }
    }).catch((err) => console.log(err))
}

function deleteProduct(id){
    const data = document.getElementById(id).dataset.url;
    const url = "http://localhost:3000/admin/product/product-details/" +data;
    const body ={
        id:data
    }
    fetch(url,{
        method:'PATCH',
        headers :{
            'Content-Type' : 'application/json'
        },
        body:JSON.stringify({body})
    }).then((response)=> response.json())
    .then((response)=>{
        if(response.successStatus){
            window.location.href=response.redirect
        }
        else{
            document.querySelector('#error').innerHTML = "An error occured please try again"
        }
    }).catch((err) => console.log(err))
}

