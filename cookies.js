var today = new Date();
function setCookie(name, value)
{
var thisCookie = name + "=" + escape(value); 
document.cookie = thisCookie;
}
function showCookie(){
alert(unescape(document.cookie));
}
function getCookie(name)
{
var re=new RegExp(name+"=([^;]+)"); 
var value= re.exec(document.cookie); 
return(value!=null)?unescape(value [1]): null;
}
function deleteAllCookies() {
var cookies = document.cookie.split(";");

for (var i = 0; i < cookies.length; i++) 
{ var cookie = cookies[i];
var eqPos = cookie.indexOf("=");
var name = eqPos> -1 ? cookie.substr(0, eqPos): cookie; 
document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}
}
