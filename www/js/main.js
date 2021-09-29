window.onload=function()
{
    document.getElementById("btnPrijava").addEventListener("click",Prijava);
    document.getElementById("btnPovratak").addEventListener("click",Povratak);
    document.getElementById("btnsignIn").addEventListener("click",SignIn);
    document.getElementById("btnsignUp").addEventListener("click",SignUp);
    document.getElementById("btnRezerviraj").addEventListener("click",Rezerviraj);
    document.getElementById("btnPrikazRezervacija").addEventListener("click",PrikazRezervacije)
    document.getElementById("btnOdjava").addEventListener("click",Odjava);
    document.getElementById("btnPrijavaRestorana").addEventListener("click", PrijavaRestorana);
    document.getElementById("btnOdjava2").addEventListener("click", Odjava2);
    document.getElementById("btnRezervacijeRestorani").addEventListener("click",RezervacijeRestorani);
    var inp = document.getElementsByTagName('input');
    for (var i = inp.length-1; i>=0; i--) {
        if ('radio'===inp[i].type) inp[i].checked = false;
    }
}

//STRANICE
function Povratak()
{
    window.location="#signIn-page";
}

function Povratak2() 
{
  window.location = "#signIn-page";
}

function SignUp()
{
    if (document.getElementById("gost").checked == true) 
    {
        window.location = "#signUp-page";
    } 
    else if (document.getElementById("restoran").checked == true) 
    {
        window.location = "#signUpRestoran-page";
    } 
    else 
    {
        window.alert("Morate odabrati jeste li korisnik ili vlasnik!");
    } 
}
var ime;
var prezime;
var email;
var mobitel;
var password;
var popisRezervacija=[];

//VARIJABLE ZA RESTORAN
var imeRestorana;
var emailR;
var passR;
var maxBrG;
var brojStolova;
var otvaranje;
var zatvaranje;
var popisRezervacija2 = [];

//BAZA

var db;
var shortName="Moja baza";
var version="1.0";
var displayName="Moja WebSQL baza";
var maxSize=65535;
db=openDatabase(shortName,version,displayName,maxSize);
db.transaction(stvoriTablicu,errorHandler,sveOK);

function errorHandler(transaction,err){
    alert("Alert: "+ err.message +", kod: "+ err.code);
}
function sveOK(){
    console.log("Akcija izvršena!");
}
function stvoriTablicu(tx)
{
    tx.executeSql('CREATE TABLE IF NOT EXISTS Korisnik(Name TEXT NOT NULL,Last_Name TEXT NOT NULL,Phone_Number TEXT NOT NULL,Email TEXT NOT NULL,Password TEXT NOT NULL)',[],sveOK,errorHandler);
    tx.executeSql('CREATE TABLE IF NOT EXISTS Rezervacije(RestaurantName TEXT NOT NULL,Guest_number TEXT NOT NULL,Date TEXT NOT NULL,Time TEXT NOT NULL,Email TEXT NOT NULL)', [], sveOK, errorHandler);
    tx.executeSql("CREATE TABLE IF NOT EXISTS Restorani(Restaurant TEXT NOT NULL,Max_guest_number TEXT NOT NULL,Table_number TEXT NOT NULL,Open TEXT NOT NULL,Closed TEXT NOT NULL,Email TEXT NOT NULL,Password TEXT NOT NULL)",[],sveOK,errorHandler);

}


//UNOS KORISNIKA U BAZU
function Prijava(){
    db.transaction(dodaj,errorHandler,sveOK);
}
function dodaj(t)
{
    ime=document.getElementById("ime").value;
    prezime=document.getElementById("prezime").value;
    email=document.getElementById("email2").value;
    mobitel=document.getElementById("broj").value;
    password=document.getElementById("lozinka").value;
    var greska=false;
    var poruka="";
    var regZnakovi=/[^a-zA-Z0-9]+/;
    var regBrojevi=/[0-9]+/;

    //IME
    if(ime=="" || prezime=="" || email=="" || mobitel=="" || password=="")
    {
        poruka="Nijedno polje ne smije ostati prazno!\n";
        greska=true;
    }
    
    if(regZnakovi.test(ime)==true || regBrojevi.test(ime)==true)
    {
        poruka+=" Neispravan unos imena. Smije sadržavati samo slova!\n";
        greska=true;
    }
    //PREZIME
    if(regZnakovi.test(prezime)==true || regBrojevi.test(prezime)==true)
    {
        poruka+=" Neispravan unos prezimena. Smije sadržavati samo slova!\n";
        greska=true;
    }

    //E-MAIL
    var znak=email.includes("@");
    if(znak==false)
    {
        poruka+=" Neispravan unos e-mail adrese!\n";
        greska=true;
    }

    //MOBITEL
    if(mobitel.length<10)
    {
        poruka+=" Broj mobitela mora sadržavati najmanje 10 znamenki!\n";
        greska=true;
    }

    if(greska==true)
    {
        window.alert(poruka);
    }
    else
    {
        t.executeSql('INSERT INTO Korisnik(Name,Last_Name,Phone_Number,Email,Password) VALUES (?,?,?,?,?)',[ime,prezime,mobitel,email,password],sveOK,errorHandler);
        localStorage.setItem("korisnik",email);
        window.alert("Uspješno ste se prijavili!");
        window.location="#home-page";
        document.getElementById("ime").value="";
        document.getElementById("prezime").value="";
        document.getElementById("email2").value="";
        document.getElementById("broj").value="";
        document.getElementById("lozinka").value="";
    }
    
}

//PRIJAVA RESTORANA
function PrijavaRestorana() 
{
  db.transaction(dodajRestoran, errorHandler, sveOK);
}

function dodajRestoran(t) 
{
  var greska = false;
  var poruka = "";
  var regZnakovi = /[^a-zA-Z0-9]+/;
  var regBrojevi = /[0-9]+/;

  imeRestorana = document.getElementById("imeRestorana").value;
  maxBrG = document.getElementById("maxBrojGostiju").value;
  brojStolova = document.getElementById("brojStolova").value;
  otvaranje = document.getElementById("otvaranje").value;
  zatvaranje = document.getElementById("zatvaranje").value;
  emailR = document.getElementById("emailRestorana").value;
  passR = document.getElementById("passRestorana").value;

  if(imeRestorana=="" || emailR=="" || maxBrG=="" || brojStolova=="" || otvaranje=="" || zatvaranje=="" || passR=="")
  {
      poruka+= "Nijedno polje ne smije ostati prazno!\n";
      greska=true;
  }

  //IME RESTORANA

  //E-MAIL RESTORANA
  var znak = emailR.includes("@");
  if (znak == false) 
  {
    poruka += " Neispravan e-mail.";
  }

  if (greska == true) 
  {
    window.alert(poruka);
  } 
  else 
  {
    t.executeSql("INSERT INTO Restorani(Restaurant,Max_guest_number,Table_number,Open,Closed,Email,Password) VALUES (?,?,?,?,?,?,?)",[imeRestorana, maxBrG, brojStolova, otvaranje, zatvaranje, emailR, passR],sveOK,errorHandler);
    localStorage.setItem("korisnik", emailR);
    window.alert("Uspješno ste se prijavili!");
    window.location = "#home-page-restorani";

    document.getElementById("imeRestorana").value = "";
    document.getElementById("emailRestorana").value = "";
    document.getElementById("passRestorana").value = "";
    document.getElementById("maxBrojGostiju").value = "";
    document.getElementById("brojStolova").value = "";
    document.getElementById("otvaranje").value = "";
    document.getElementById("zatvaranje").value = "";
  }
 
}

//PRIJAVA POSTOJEĆEG KORISNIKA
function SignIn()
{
    db.transaction(citajKorisnika, errorHandler,sveOK);
}

function citajKorisnika(t)
{
    var emailPrijava=document.getElementById("email").value;
    var passPrijava=document.getElementById("pass").value;
    if(emailPrijava=="" || passPrijava=="")
    {
        window.alert("Molim unesite svoj e-mail i password!");
    }
    else if (document.getElementById("gost").checked == true) 
    {
        t.executeSql("SELECT * FROM Korisnik WHERE (Email LIKE ? AND Password LIKE ?);",["%" + emailPrijava + "%", "%" + passPrijava + "%"],obradaRezultataKorisnika,errorHandler);
        document.getElementById("email").value = "";
        document.getElementById("pass").value = "";
    } 
  else if (document.getElementById("restoran").checked == true) 
  {
    t.executeSql("SELECT * FROM Restorani WHERE (Email LIKE ? AND Password LIKE ?);",["%" + emailPrijava + "%", "%" + passPrijava + "%"],obradaRezultataKorisnika,errorHandler);
    document.getElementById("email").value = "";
    document.getElementById("pass").value = "";

  } 
  else 
  {
    window.alert("Označite jeste li gost ili vlasnik restorana!");
  }

}

function obradaRezultataKorisnika(t,rez)
{
    if(rez!=null && rez.rows!=null)
    {
        for (var i=0;i<rez.rows.length;i++)
        {
            var podatak=rez.rows.item(i);
            localStorage.setItem("korisnik",podatak.Email);
            
            if (document.getElementById("gost").checked == true) 
            {
                window.location = "#home-page";
            } 
            else if (document.getElementById("restoran").checked == true) 
            { 
                window.location = "#home-page-restorani";
            } 
            else 
            {
                window.alert("Odaberite jeste li gost ili vlasnik restorana!");
            }
        }
    }
    if(rez.rows.length==0)
    {
        if (confirm("Vaš račun ne postoji. Želite li napraviti novi?"))
        {
            if (document.getElementById("gost").checked == true) 
            {
                window.location = "#signUp-page";
            } 
            else if (document.getElementById("restoran").checked == true) 
            {
                window.location = "#signUpRestoran-page";
            } 
            else 
            {
                window.alert("Odaberite jeste li gost ili vlasnik restorana!");
            }
        }
    }
}


function Rezerviraj()
{
    db.transaction(spremiRezervaciju, errorHandler,sveOK);
}
function spremiRezervaciju(t)
{
    var restoran;
    var broj_gostiju;
    var datum;
    var vrijeme;
    var flag=false;

    if(restoran=="" || broj_gostiju=="" || datum=="" || vrijeme=="")
    {
        window.alert("Nijedno polje ne smije biti prazno!");
        greska=true;
    }

    restoran=document.getElementById("odabraniRestoran").value;
    broj_gostiju=document.getElementById("brojLjudi").value;
    if(broj_gostiju>10)
    {
        window.alert("Maksimalan broj gostiju je 10!");
        //greska=true;
    }
    datum=document.getElementById("datum").value;
    vrijeme=document.getElementById("vrijeme").value;

    for(var a=0;a<popisRezervacija.length;a++)
    {
        if(popisRezervacija[a]==restoran)
        {
            flag=true;
        }
    }
    var imePrijava=localStorage.getItem("korisnik");
    if(flag==true)
    {
        window.alert("Već imate rezervaciju u tom restoranu!");
    }
    else
    {
        t.executeSql('INSERT INTO Rezervacije(RestaurantName,Guest_number,Date,Time,Email) VALUES (?,?,?,?,?)',[restoran,broj_gostiju,datum,vrijeme,imePrijava],sveOK,errorHandler);
        //window.location="#home-page";
        window.alert("Rezervacija spremljena!");
        
    }

    document.getElementById("odabraniRestoran").value="";
    document.getElementById("brojLjudi").value="";
    document.getElementById("datum").value="";
    document.getElementById("vrijeme").value="";
}

//PRIKAZ REZERVACIJE
function PrikazRezervacije()
{
    var ul=document.getElementById("myUL");
    ul.innerHTML="";
    db.transaction(ispisRezervacija,errorHandler,sveOK);
}

function ispisRezervacija(t)
{
    var imePrijava1=localStorage.getItem("korisnik");
    t.executeSql("SELECT * FROM Rezervacije WHERE Email='"+imePrijava1+"';",[], obradaRezultataIspisa, errorHandler);
}

function obradaRezultataIspisa(t, rez6)
{
    if(rez6!=null && rez6.rows!=null)
    {
        for(var i=0;i<rez6.rows.length;i++)
        {
            var podatak=rez6.rows.item(i);
            popisRezervacija.push(podatak.RestaurantName);
            var li=document.createElement("li");
            var inputValue="Restoran: " + podatak.RestaurantName+"\n" + "Broj gostiju: " + podatak.Guest_number + "\n" + "Datum: " + podatak.Date + "\n" +"Vrijeme: " + podatak.Time;
            var t=document.createTextNode(inputValue);
            li.appendChild(t);
            document.getElementById("myUL").appendChild(li);
            document.getElementById("nematodo").style.display="none";
        }
    }
    if(rez6.rows.length==0)
    {
        document.getElementById("nematodo").style.display="block";
        document.getElementById("nematodo").innerHTML="Your to-do list is empty!";
    }
}


//PRIKAZ REZERVACIJA ZA RESTORANE
function RezervacijeRestorani()
{
    var ul=document.getElementById("myUL2");
    ul.innerHTML="";
    db.transaction(ispisRezervacijaRestorani,errorHandler,sveOK);
}

function ispisRezervacijaRestorani(t)
{
    var imePrijava2=localStorage.getItem("korisnik");
    t.executeSql("SELECT * FROM Restorani r, Rezervacije re, Korisnik k WHERE r.Restaurant = re.RestaurantName AND k.Email = re.Email AND r.Email='"+imePrijava2+"';",[], obradaRezultataIspisa2, errorHandler);
}

function obradaRezultataIspisa2(t,rez7)
{
    if(rez7!=null && rez7.rows!=null)
    {
        for(var i=0;i<rez7.rows.length;i++)
        {
            var podatak=rez7.rows.item(i);
            //popisRezervacija.push(podatak.RestaurantName);
            var li=document.createElement("li");
            var inputValue="Ime i prezime gosta: " + podatak.Name +" " + podatak.Last_Name + "\n" + "Broj gostiju: " + podatak.Guest_number + "\n " + "Datum: " +podatak.Date + "\n "+" Vrijeme: " + podatak.Time;
            var t=document.createTextNode(inputValue);
            li.appendChild(t);
            document.getElementById("myUL2").appendChild(li);
            document.getElementById("nematodo").style.display="none";
            
        }
    }
    if(rez7.rows.length==0)
    {
        document.getElementById("nematodo").style.display="block";
        document.getElementById("nematodo").innerHTML="Your to-do list is empty!";
    }
}

function Odjava()
{
    popisRezervacija=[];
    localStorage.clear();
}
function Odjava2() 
{
  localStorage.clear();
}

//MAPA
var map;
var infowindow;
var coords;
var request;
function initMap(){
    let location=new Object();
    // navigator.geolocation.getCurrentPosition(function(position){
    //     location.lat=position.coords.latitude;
    //     location.long=position.coords.longitude;
    // });
    
    var center= new google.maps.LatLng(43.508133, 16.440193);
    map = new google.maps.Map(document.getElementById("map"),{
    center:center,
    zoom: 16
    });

    request = {
    location: center,
    radius: 500,
    types: ["restaurant"]
    };
    infowindow= new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request,callback);
}


function callback(results, status){
    if(status == google.maps.places.PlacesServiceStatus.OK){
        for(var i=0;i<results.length;i++){
        //console.log(results);
        createMarker(results[i]);
        }
            
    }
}

function createMarker(place){
var placeLoc=place.geometry.location;
var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
});


google.maps.event.addListener(marker, "click", function(){
infowindow.setContent(place.name);
document.getElementById("odabraniRestoran").value= place.name;
infowindow.open(map,this);
});
}

//let dio1='<div class="container left"><div class="content"><h2>';
// let dio2='</h2><br><p>';
// let dio3='</p></div></div>';
// let btn='<button id="uredi_bilj'+br+'" class="edit" value=' +_naslov+' onclick="uredujemRezervaciju('+br+')"><i class="fa fa-edit"></i></button>';
// let btn2='<button id="brisi_bilj'+br+'" class="edit" value='+_naslov+'   onclick="brisemRezervaciju('+br+')"><i class="fa fa-trash"></i></button>';
//var p=document.createElement("p");
//var inputValue="Restoran: " + podatak.RestaurantName+"\n" + "Broj gostiju: " + podatak.Guest_number + "\n" + "Datum: " + podatak.Date + "\n" +"Vrijeme: " + podatak.Time;

//function uredivanjeRezervacije(k) {
//     let l =document.getElementById("uredi_rez"+k ).value;
//     localStorage.setItem("uredi",l);
//     window.location="#home-page";
//}
//   let zastavica

//function brisanjeRezervacije(k){
//     zastavica=-1;
//     let l=document.getElementById("brisi_rez"+k).value;
//     for (var i=0;i<sve_bilje.length;i++){
//       if (sve_bilje[i].datum==l){
//         let kljuc=sve_bilje[i].kljuc;
//         let userRef = database.ref('biljeske/' + kljuc);
//         if (confirm("Želite li obrisati rezervaciju na odabrani datum?")) {
//           userRef.remove();
//           window.location.reload();
//         } else {
//           return;
//         }
//         zastavica=i;
//       }
//     };
//     if (zastavica >= 0 ){
//       sve_bilje.splice(zastavica,1);
  
//     }
//}
