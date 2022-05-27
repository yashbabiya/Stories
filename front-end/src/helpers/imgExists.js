export default function imageExists(image_url){

    var http = new XMLHttpRequest();

    http.open('HEAD', image_url, false);
    
    console.log(http);
    return http.status < 300;

}