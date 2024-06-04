class TreeView extends HTMLElement{

    static get observedAttributes() {
        return ['checked'];
    }

    constructor(){
        super();
        // this.attachShadow({mode: 'open'});
        this.elcuerpo = document.getElementById('cuerpo');
        const idTv = document.getElementById('tv');
        this.header(idTv.getAttribute('header'));
        this.data = JSON.parse(idTv.getAttribute('TreeData'));
        this.createTree(this.data) ;
        this.checkboxes = document.querySelectorAll('input[type="checkbox"]');
        this.updateCheckbox(this.checkboxes);
        this.removeElements();

    }

    setTreeData(){
        //this.creataTree(data);
    }

    header(headerData){
        const headerElement = document.createElement('h1');
        headerElement.innerText = headerData;
        this.elcuerpo.appendChild(headerElement);
    }

      hideElements(){
        const arrows = document.querySelectorAll('.flecha');
    
        arrows.forEach(arrow => {

            arrow.addEventListener('click', () => {
                const padre = arrow.parentElement;
                const ul = padre.querySelector('ul');
                ul.classList.toggle('sublist');
                if(arrow.classList.contains('fa-chevron-right')){
                    arrow.classList.remove('fa-chevron-right');
                    arrow.classList.add('fa-chevron-down');
                }else if(arrow.classList.contains('fa-chevron-down')){
                    arrow.classList.remove('fa-chevron-down');
                    arrow.classList.add('fa-chevron-right');
                }
            })
        }
        )
    
    }
    
    
    
    
      createItem(item, parentId = ''){
        const ul = document.createElement('ul');
        ul.setAttribute('semi-root', 'true');
        let j = 1;
        
        for (const datakey of item) {
            
    
            const i = document.createElement('i');
            i.style.cursor = 'pointer';
            i.classList.add('fa-solid');
            i.classList.add('fa-chevron-right');
            i.classList.add('flecha');
    
            const i2 = document.createElement('i');
            i2.style.cursor = 'pointer';
            i2.style.rigth = '0';
            i2.classList.add('fa-solid');
            i2.classList.add('fa-trash');

    
    

            
            const li = document.createElement('li');

    
    
            
            
            li.setAttribute('item', datakey.titulo);
            li.setAttribute('espadre', datakey.espadre);
            li.innerText = datakey.titulo;


    
    
            const checkbox = document.createElement('input');
            checkbox.setAttribute('type', 'checkbox');
            checkbox.classList.add('mycheck');
    
    
            checkbox.setAttribute('padre', datakey.titulo);
            li.insertAdjacentElement('afterbegin', checkbox);
            ul.appendChild(li);



            if(datakey.checked){
                checkbox.checked = datakey.checked;
                // if(datakey.hijos){
                //     for (let index = 0; index < datakey.hijos.length; index++) {
                //         // console.log(datakey.hijos[index].checked);
                //         // console.log(datakey.checked);
                //         datakey.hijos[index].checked = datakey.checked;
                //     }
                // }
            }
    
            li.appendChild(i2);

            // if(datakey.content && datakey.content != ""){
            //     li.innerHTML += datakey.content; 
            // }

            if(datakey.hijos && datakey.hijos.length > 0){
               li.insertAdjacentElement('afterbegin', i);
               let child = this.createItem(datakey.hijos);

               child.setAttribute('semi-root', 'false');

               child.classList.add('sublist');

               li.appendChild(child);

            }

            j++;
    }     
        return ul;
    }


    
    
    
    
    
      createTree(data){
        let i = 1;
        for (const treeItem of data) {
            const treeList = this.createItem([treeItem]);    
            this.elcuerpo.appendChild(treeList);
            i++;
        }
        this.hideElements();
    }
    
    
    
      updateCheckbox(collection){
    
    
        // let alreadyChecked = this.checkedCode(collection);
        const divc = document.createElement('div');





    
    
        collection.forEach((check)=>{
            // check.addEventListener('change', this.count);
            




     
            check.addEventListener('change', ()=>{
                let padreLi = check.parentElement;
                let sisterUl = padreLi.querySelector('ul');
                let rootUl = padreLi.parentElement;
                let rootLi = rootUl.parentElement;
                if(check.checked){
                    check.setAttribute('checked', ' true');
                }else{
                    check.removeAttribute('checked');
                }
    

    
            if(sisterUl){
                // console.log('estoy en el if')
                this.updateChildren(check);
                if((rootLi.getAttribute('espadre') === 'true')){
                    // console.log('estoy en el if anidado');
                    this.updateFather(check);
                }

            }else if(rootLi.getAttribute('espadre') === 'true'){
                // console.log('estoy entrando desde el else if');
                this.updateFather(check);
            }
        }
            )
            
        })
    }
    
      updateChildren(item){
        console.log('FUNCION UPDATE CHILDREN');
    
        let countChecked = 0;
    
        //Padre de la checkbox que se le acaba de cambiar el estado. (una li).
        const father = item.parentNode;
        //Ul hermana de la checkbox (donde estan los hijos).
        const sisterUl = father.querySelector('ul');
        //Los checkbox de los hijos
        const arrayChildren = [...sisterUl.querySelectorAll('input[type="checkbox"]')]; 
    
        arrayChildren.forEach((child)=>{
    
            if(item.checked){
                if(child.indeterminate){
                    child.indeterminate = false;
                }
                child.checked = item.checked;
                countChecked++;
                // console.log(`countchecked ahora es ${countChecked}`);
            }else{
                child.checked = item.checked;
                countChecked--;
                // console.log(`countchecked ahora es ${countChecked}`);
            }
        })
    
        if(item.checked){
            countChecked++;
        }
        else{
            countChecked--;
        }
        
    
        if(countChecked < 0){
            countChecked = 0;
        }
    
    
        
        return countChecked;
    }
    
      updateFather(item){
        console.log('FUNCION UPDATE FATHER');
    
        let padreLi = item.parentElement;
        let rootUl = padreLi.parentElement;
        let rootLi = rootUl.parentElement;
    
        let checkedUl = 0;
        let checkboxesUl = [...rootUl.querySelectorAll('input[type="checkbox"]')];
    
    
        checkboxesUl.forEach((checkUl)=>{
    
            if(checkUl.checked){
                checkedUl++;
            }
        });
        
        const checkRoot = rootLi.querySelector('input[type="checkbox"]');

        if(checkedUl === checkboxesUl.length){
            // console.log(`estoy en el if, ${checkedUl} es igual a ${checkboxesUl.length}`)
            checkRoot.indeterminate = false;
            checkRoot.checked = true;

            // console.log(checkRoot.parentElement.parentElement.parentElement == document.querySelector('body'));

            if(!(checkRoot.parentElement.parentElement.parentElement == document.querySelector('body'))){
                // console.log('estoy apunto de llamarme a mi mismo');
            this.updateFather(checkRoot);
            }else if(checkedUl === checkboxesUl.length){
                checkRoot.checked = true;
            }
            
    
        }else if(checkedUl === 0){
            checkRoot.indeterminate = false;
            checkRoot.checked = false;
        }else{
            // console.log('estoy en el else');
            checkRoot.checked = false;
            checkRoot.indeterminate = true;
        }
    
    }
    
    
      checkedCode(collection){
        let alreadyChecked = 0;

        collection.forEach((checkbox)=>{
            let padreLi = checkbox.parentElement;
            let sisterUl = padreLi.querySelector('ul');
            let rootUl = padreLi.parentElement;
            let rootLi = rootUl.parentElement;
            if(checkbox.checked){
                alreadyChecked++;
                checkbox.setAttribute('checked', ' true');
               
                if(sisterUl){
                    // console.log('estoy en el if')
                    alreadyChecked += this.updateChildren(checkbox);
                    if((rootLi.getAttribute('espadre') === 'true')){
                        // console.log('estoy en el if anidado');
                        this.updateFather(checkbox);
                    }
                    // console.log(`cantidad de checkboxes checkeadas ${alreadyChecked}`);
                }else if(rootLi.getAttribute('espadre') === 'true'){
                    // console.log('estoy entrando desde el else if');
                    this.updateFather(checkbox);
                }
            }else{
                // console.log(checkbox);
                // console.log(`estoy colocando`)
                checkbox.removeAttribute('checked');
            }

        });
        return alreadyChecked;
    }
    
      removeElements(){
        const trashs = document.querySelectorAll('.fa-trash');
        trashs.forEach((trash)=>{
    
            trash.addEventListener('click',()=>{
                // console.log(trash.parentElement.innerText);
                trash.parentElement.remove();
            })
        })
    }

     checkByName(id) {
        const listItems = document.querySelectorAll('li');
        const listCheckbox = document.querySelectorAll('input[type="checkbox"');


        Array.from(listCheckbox).forEach((check)=>{
            let padreLi = check.closest('li');
            let item = padreLi.getAttribute('item');
           if (item == id) {

            check.checked = true;
            this.checkedCode(listCheckbox);
        }
        })
    }

    initialize() {



        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        const div = document.createElement('div');
        this.elcuerpo.appendChild(div);


        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener('change', () => {

                div.innerText = this.countCheckedCheckboxes();
            });
        });
        
    }
    
    countCheckedCheckboxes() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        
        
        let checkedCount = 0;

        checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                checkedCount++;
            }
        });


        if (checkedCount > 0) {
            this.setAttribute('checked', `${checkedCount}`);
        } else {
            this.setAttribute('checked', 0);
        }

        // console.log(`Número de checkboxes chequeadas: ${checkedCount}`);
        
        return checkedCount;
    }

    connectedCallback(){

        this.checkByName('item 1');
        // this.checkByName('item 1.2');
        // this.checkByName('item 1.3');
        this.initialize();
    }

    attributeChangedCallback(attributeName, oldValue, newValue) {
        if (attributeName === 'checked') {
            console.log(`El atributo 'checked' cambió de ${oldValue} a ${newValue}`);
        }
    }


    
}

customElements.define('tree-view', TreeView);

