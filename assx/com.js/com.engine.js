import { dex, assoc } from './com.dexkit.js';

dex.load('/assx/com.css/com.config.css');
dex.load('/assx/com.css/com.fit.css');
dex.load('/assx/com.js/com.back.js', {module: true})
dex.get.item('c', 'class').addEventListener('click', window.apxcontrols.apxcls);
dex.get.item('mx', 'class').addEventListener('click', window.apxcontrols.apxmax);
dex.get.item('mn', 'class').addEventListener('click', window.apxcontrols.apxmin);

const pathicon = {

    normal: 'fi-sc-dollar',
    js: 'fi-rr-script',
    dex: 'fi-sr-bolt',
    git: 'fi-rr-code-branch',
    npm: 'fi-rr-box',

}

//Tasks

let runned = false;
localStorage.removeItem('$USERMACHINE(LASTPATH)');
let Selection = [];
let CommandsList = [];

dex.get.collection('input', 'tag').forEach(input => {

  input.setAttribute('data-context', 'input')

})

assoc.maxstate.maxon(() => {

    dex.get.item('Maximize', 'class').style.display = "none";
    dex.get.item('Restore', 'class').style.display = "block";

})

assoc.maxstate.maxres(() => {

    dex.get.item('Maximize', 'class').style.display = "block"
    dex.get.item('Restore', 'class').style.display = "none"

})

async function GetUIColor(){

const sysColor = await assoc.apxcontrols.colors();

const color = (sysColor === '006fc4e3' || sysColor === '4191a1e3')
  ? '5983a7'
  : sysColor;
  
  dex.get.collection('applyuicolor-fill', 'class').forEach((icon, index) => {

    icon.style.color = `#${color}`;

  })

  dex.get.collection('corner', 'tag').forEach((corner, index) => {

    corner.style.backgroundColor = `#${color}`;

  })

  dex.get.collection('applyuicolor-stroke', 'class').forEach((element, index) => {

    element.style.backgroundColor = `#${color}`;

  })

  const setcolor = document.createElement('style');
  setcolor.innerHTML = `
  
    ::-webkit-scrollbar-thumb{

    background-color: #${color};
    border-radius:20px;

  }

  `
  document.head.appendChild(setcolor)

}

assoc.apxcontrols.ucolor(async (_, rawColor) =>  {

  const color = (rawColor === '006fc4e3' || rawColor === '4191a1e3')
    ? '5983a7'
    : rawColor;

  dex.get.collection('applyuicolor-fill', 'class').forEach((icon) => {
    icon.style.color = `#${color}`;
  });

  dex.get.collection('corner', 'tag').forEach((corner) => {
    corner.style.backgroundColor = `#${color}`;
  });

  dex.get.collection('applyuicolor-stroke', 'class').forEach((element) => {
    element.style.backgroundColor = `#${color}`;
  });

  const setcolor = document.createElement('style');
  setcolor.innerHTML = `
    ::-webkit-scrollbar-thumb {
      background-color: #${color};
      border-radius: 20px;
    }
  `;
  document.head.appendChild(setcolor);

});


GetUIColor()


const resizer = document.querySelector('.resizer');
const sidebar = document.querySelector('.sidebar');
const content = document.querySelector('.content');

let isResizing = false;
const minWidth = 200;
const maxWidth = 250;

const savedWidth = localStorage.getItem('sidebar-width');
if (savedWidth) {
    sidebar.style.width = savedWidth + 'px';
    content.style.width = `calc(100% - ${savedWidth}px)`;
}

function startResize(e) {
    isResizing = true;
    document.body.classList.add('resizing');
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
    document.addEventListener('touchmove', resize);
    document.addEventListener('touchend', stopResize);
}

function resize(e) {
    if (!isResizing) return;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const newWidth = clientX;
    if (newWidth >= minWidth && newWidth <= maxWidth) {
        sidebar.style.width = newWidth + 'px';
            content.style.width = `calc(100% - ${newWidth}px)`;

    }
}

function stopResize() {
    if (isResizing) {
        isResizing = false;
        document.body.classList.remove('resizing');
        localStorage.setItem('sidebar-width', sidebar.offsetWidth);
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
        document.removeEventListener('touchmove', resize);
        document.removeEventListener('touchend', stopResize);
    }
}

resizer.addEventListener('mousedown', startResize);
resizer.addEventListener('touchstart', startResize, { passive: true });


dex.get.collection('.mainfolders child', 'tag').forEach((option, index) => {

    const shortdirmap = ["apx:home", 'desktop', 'downloads', 'documents', 'apx:oschub']
    option.addEventListener('click', () => { if(shortdirmap[index] != 'apx:home' && shortdirmap[index] != 'apx:oschub'){     dex.get.item('about', 'class').classList.remove('active') ;dex.get.item('directories', 'class').classList.remove('active'); dex.get.item('directories', 'class').classList.add('exit'); setTimeout(() => {RenderFiles(assoc.dexagent.shortdir(shortdirmap[index]));}, 300); setTimeout(() => {dex.get.item('directories', 'class').classList.remove('exit'); dex.get.item('directories', 'class').classList.add('active');    }, 600); if(runned == false){dex.new.transition('directories'); runned = true;}  }})
})

dex.get.item('AboutDex', 'class').addEventListener('click', function(){

  dex.new.transition('about')

})

/*window.addEventListener('dblclick', function(){

  assoc.dexagent.showabout();

})*/


assoc.addEventListener('contextmenu', ActivateCustomContextMenu);

function ActivateCustomContextMenu(ThisEvent) {
    ThisEvent.preventDefault();

    const ContextMenu = document.querySelector('.ContextMenu');
    const CategoriesMenu = document.querySelector('.CategoriesMenu');
    const Query = ThisEvent.target.closest('[data-context]');
    const Context = Query ? Query.getAttribute('data-context') : null;
    const Target = ThisEvent.target;

    if(Context){

        document.querySelector('.ContextMenu').classList.remove('ShowContextMenu');
        document.querySelector('.ContextMenu').style.opacity = "1"
        ContextMenu.style.visibility = "visible";

        const MenuMap = ["IndexMenu","CategoriesMenu","ProductsMenu","InputsMenu", "UsersMenu", "LinksMenu", "CustomerMenu"];

        if(Context == "input"){

            document.querySelector(`.${MenuMap[3]}`).style.display = "flex";
            const OptionMap = document.querySelectorAll(`.${MenuMap[3]} options`);

            OptionMap[0].onclick = function(){ Target.select() };
            OptionMap[1].onclick = function(){ Target.select(); navigator.clipboard.writeText(Target.value).then(() => { CreateNotification(0, "Contenido copiado en el portapapeles.") }).catch(error => {CreateNotification(0, "No se pudo copiar el contenido en el portapapeles.")}) };
            OptionMap[2].onclick = function(){ navigator.clipboard.readText().then(Content => { Target.value = Content }) };
            OptionMap[3].onclick = function(){ Target.select(); navigator.clipboard.writeText(Target.value).then(() => { Target.value = '' }).catch(error => {CreateNotification(0, "No se pudo ejecutar el script en el portapapeles.")}) };
            OptionMap[4].onclick = function(){ Target.value = "" };

        }else if(Context == "index"){

            document.querySelector(`.${MenuMap[0]}`).style.display = "flex";
            const OptionMap = document.querySelectorAll(`.${MenuMap[0]} options`);
            OptionMap[0].onclick = function(){ WarrantiesSearcher.focus() };
            function FullScreen(){if(document.documentElement.requestFullscreen){document.documentElement.requestFullscreen();}else if(document.documentElement.mozRequestFullScreen){document.documentElement.mozRequestFullScreen();}else if(document.documentElement.webkitRequestFullscreen){document.documentElement.webkitRequestFullscreen();}else if(document.documentElement.msRequestFullscreen){document.documentElement.msRequestFullscreen();}}function ExitFullScreen(){if(document.exitFullscreen){document.exitFullscreen();}else if(document.mozCancelFullScreen){document.mozCancelFullScreen();}else if(document.webkitExitFullscreen){document.webkitExitFullscreen();}else if(document.msExitFullscreen){document.msExitFullscreen();}}function IsFullScreen(){return document.fullscreenElement||document.mozFullScreenElement||document.webkitFullscreenElement||document.msFullscreenElement;}function ToggleFullScreen(){if(!IsFullScreen()){FullScreen();}else{ExitFullScreen();}}OptionMap[1].onclick=ToggleFullScreen;
            OptionMap[2].onclick = function(){ RunOperation002() };
            OptionMap[3].onclick = function(){ RunOperation005() };
            OptionMap[4].onclick = function(){ ShowManageProducts() };
            OptionMap[5].onclick = function(){document.querySelector('.AccountMenu').classList.toggle('HideAccountMenu');};
            OptionMap[6].onclick = function(){ Base.reload() };
            OptionMap[7].onclick = function(){ LockNow() };
            OptionMap[8].onclick = function(){ alert('Ocurrió un error al ejecutar el lote com.main.js:3227:80:false') };
            OptionMap[9].onclick = function(){ assoc.close() };
            OptionMap[10].onclick = function(){ Base.reload(); };


        }else if(Context == "link"){

            document.querySelector(`.${MenuMap[5]}`).style.display = "flex";
            const OptionMap = document.querySelectorAll(`.${MenuMap[5]} options`);
            OptionMap[0].onclick = function(){ window.open(Target.href) }   
            OptionMap[1].onclick = function(){ assoc.navigator.clipboard.writeText(Target.href).then(() => { CreateNotification(0, "Contenido copiado en el portapapeles.") }).catch(error => {CreateNotification(0, "No se pudo copiar el contenido en el portapapeles.")}) };

        }else if(Context == "customer"){

            const KeyQuery = Target.closest('[data-context-key]');
            const Key = KeyQuery ? KeyQuery.getAttribute('data-context-key') : null;

            document.querySelector(`.${MenuMap[6]}`).style.display = "flex";
            const OptionMap = document.querySelectorAll(`.${MenuMap[6]} options`);    
            OptionMap[0].onclick = function(){ 

                EditCustomerNow(Key)

             };

            OptionMap[1].onclick = function(){ 

                fetch('Controllers/com.delete.list.php', {

                    method: "POST",
                    headers: {

                        "Content-Type": "Application/x-www-form-urlencoded",

                    },
                    body: `ListID=${encodeURIComponent("CustomerList")}&Condition=${encodeURIComponent(Key)}`

                })
                .then(response => response.json())
                .then(response => {

                    const Data = response.Execute;

                    if(Data == true){

                        InitManageCustomers();
                        CreateNotification(0, "Se eliminó el cliente seleccionado.")

                    }else{



                    }

                })
                .catch(error => { console.error(error) })

             };
        

        }else if(Context == "user"){

            const KeyQuery = Target.closest('[data-context-key]');
            const Key = KeyQuery ? KeyQuery.getAttribute('data-context-key') : null;

            document.querySelector(`.${MenuMap[4]}`).style.display = "flex";
            const OptionMap = document.querySelectorAll(`.${MenuMap[4]} options`);    
            OptionMap[0].onclick = function(){ 

                EditUserNow(Key)

             };
            OptionMap[1].onclick = function(){ 

            fetch('Controllers/com.delete.list.php', {

                method: "POST",
                headers: {

                    "Content-Type": "Application/x-www-form-urlencoded",

                },
                body: `ListID=${encodeURIComponent("UserList")}&Condition=${encodeURIComponent(Key)}`

            })
            .then(response => response.json())
            .then(response => {

                const Data = response.Execute;

                if(Data == true){

                    InitManageUsers();
                    CreateNotification(0, "Se cambió estado de la cuenta seleccionada.")

                }else{



                }

            })
            .catch(error => { console.error(error) })

            };

            OptionMap[2].onclick = function(){

                const Password = `AIH${new Date().getFullYear()}$$`;

                fetch('Controllers/com.update.password.php', {

                    method: "POST",
                    headers: {

                        "Content-Type": "application/x-www-form-urlencoded",

                    },
                    body: `Password=${encodeURIComponent(Password)}&Key=${Key}`

                })
                .then(response => response.json())
                .then(response => {

                    if(response.execute == true){

                        CreateNotification(0, "Se restableció la contraseña de esta cuenta.");
                        
                    }else if(response.execute == false){

                        const Code = response.code;

                        if(Code == "500"){

                            CreateNotification(0, "Ocurrió un error al procesar la solicitud, inténtalo nuevamente.");
    
                        }else if(Code == "401"){
    
                            CreateNotification(0, "Solicitud no autorizada");
    
                        }

                    }

                })
                .catch(error => console.error(error));

            }

        }

    }else{DisactivateCustomContextMenu()};

    setTimeout(() => {

        ContextMenu.classList.add('ShowContextMenu');

    }, 0);

    const menuWidth = 260; 
    const menuHeight = ContextMenu.offsetHeight;
    const viewportWidth = assoc.innerWidth;
    const viewportHeight = assoc.innerHeight;

    let PositionY = ThisEvent.pageY + 10;
    let PositionX = ThisEvent.pageX + 10;

    if (PositionX + menuWidth > viewportWidth) {
        PositionX = viewportWidth - menuWidth - 10; 
    }

    if (PositionY + menuHeight > viewportHeight) {
        PositionY = viewportHeight - menuHeight - 10;
    }

    ContextMenu.style.top = `${PositionY}px`;
    ContextMenu.style.left = `${PositionX}px`;
}

assoc.addEventListener('click', DisactivateCustomContextMenu);

function DisactivateCustomContextMenu(){

    document.querySelector('.ContextMenu').classList.remove('ShowContextMenu')
    document.querySelector('.ContextMenu').style.opacity = "0"
    document.querySelector('.ContextMenu').style.visibility = "hidden";

    const InternalMenus = document.querySelectorAll('.ContextMenu menu');

    InternalMenus.forEach(element => {
        
        element.style.display = "none";

    });

}

const terminalElement = document.getElementById("terminal");
const inputElement = document.getElementById("input");
inputElement.addEventListener('keydown', RemoveWelcome);

function RemoveWelcome(e){

  if(e.keyCode === 13 && inputElement.value.trim() !== '' && !inputElement.value.includes('dex')){dex.new.transition('Terminal')}

}

function ShowWelcome(){

  dex.new.transition('welcome')

}

setInterval(() => {
    
    inputElement.focus()

}, 1);

inputElement.addEventListener('keydown', GetType);
inputElement.addEventListener('keyup', GetType);
const TypeIcon = dex.get.item('TypeIcon', 'class');

function GetType(){

    if(inputElement.value.startsWith('npm')){

        TypeIcon.classList.remove(pathicon.normal,pathicon.js, pathicon.npm, pathicon.git, pathicon.dex);
        TypeIcon.classList.add(pathicon.npm);

    }else if(inputElement.value.startsWith('js')){

        TypeIcon.classList.remove(pathicon.normal,pathicon.js, pathicon.npm, pathicon.git, pathicon.dex);
        TypeIcon.classList.add(pathicon.js);

    }else if(inputElement.value.startsWith('git')){

        TypeIcon.classList.remove(pathicon.normal,pathicon.js, pathicon.npm, pathicon.git, pathicon.dex);
        TypeIcon.classList.add(pathicon.git);

    }else if(inputElement.value.startsWith('dex')){

        TypeIcon.classList.remove(pathicon.normal,pathicon.js, pathicon.npm, pathicon.git, pathicon.dex);
        TypeIcon.classList.add(pathicon.dex);

    }else{

        TypeIcon.classList.remove(pathicon.normal,pathicon.js, pathicon.npm, pathicon.git, pathicon.dex);
        TypeIcon.classList.add(pathicon.normal);

    }

}

function Append(text) {
  const div = document.createElement("div");
  div.textContent = text;
  terminalElement.appendChild(div);
  terminalElement.scrollTop = terminalElement.scrollHeight;
}

function Clear() {
  terminalElement.innerHTML = "";
  dex.new.transition('welcome');
}

inputElement.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {

    const command = inputElement.value;
    CommandsList.push(command);

    if (command === "cls") {
      Clear();
      inputElement.value = "";
      return;
    }else if(command === 'exit'){

      window.apxcontrols.apxcls();
      return

    }else if(command.includes('dex')){

      if(command == 'dex about' || command == 'dex -v' || command == 'dex -about'){

        window.terminalApi.about();

      }

      return

    }else if(command.includes('linex')){

      if(command == 'linex about' || command == 'linex -v' || command == 'linex -about'){

        window.terminalApi.about();

      }

    }

    terminalApi.write(command);
    inputElement.value = "";
    //dex.new.transition('welcome');
  }
});

terminalApi.onData((data) => Append(data));
terminalApi.onClear(() => Clear());


window.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.shiftKey && e.code === "KeyC") {
    e.preventDefault();
    window.apxcontrols.cancel()
  }
});

/*  assoc.dexagent.showabout();  */

let uptap = 0;
let downtap = 0;
let limit = CommandsList.length;

let historyIndex = CommandsList.length; // empieza "fuera" del array

inputElement.addEventListener('keydown', (e) => {
  if (e.keyCode === 13) {
    historyIndex = CommandsList.length;
  } else if (e.keyCode === 38) {
    e.preventDefault();

    if (historyIndex > 0) {
      historyIndex--;
      inputElement.value = CommandsList[historyIndex];
    }

  } else if (e.keyCode === 40) {
    e.preventDefault();

    if (historyIndex < CommandsList.length - 1) {
      historyIndex++;
      inputElement.value = CommandsList[historyIndex];
    } else {
      historyIndex = CommandsList.length;
      inputElement.value = "";
    }

  }
});
