let demoArray = ['Complete online Javascript Course', "Jog around the park 3x", "10 minutes meditation", "Read for 1 hour", "Pick up groceries", "Complete Todo app on Frontend Mentor"]; //array with some predefined items for demo
let completedTasksArray = []; //completed tasks go here
let newToDoArray = []; //new items go here


const maxMediaQueryCrossImagesHover = window.matchMedia("(max-width: 1079px)"); //Max media query at which the X buttons are static //mobile
const minMediaQueryCrossImagesHover = window.matchMedia("(min-width: 1080px)");//Min width at which the X buttons get some hover functionality //desktop


const main = document.querySelector("main"); //MAIN tag selector
const toDoList = document.querySelector("#sortablelist"); //UL tag selector
const create_todo_text_check = document.querySelector("#create-todo-check"); //Insert text checkbox
const toDoTextInsert = document.querySelector("#create-todo-text"); //Main text insert input
const numberOfItemsLeft = document.querySelector("#no-of-items"); //Number of items left - span elem
const clear_completed = document.querySelector("#clear-completed"); //Clear completed button




const initialLoad = () => { //Main function that gets executed on page load
    if (window.localStorage.getItem('theList')) { //If there is a list stored from previous sessions

        let todoItems = JSON.parse(window.localStorage.getItem('theList')); //Parse the list

        todoItems.forEach((item, index) => { //For each list item found from LocalStorage
            const listItem = document.createElement("LI"); //Create items
            const input_checkbox = document.createElement("input");
            const input_text = document.createElement("input");
            const crossImg = document.createElement("img");

            input_checkbox.type = "checkbox";
            input_checkbox.id = `checkbox-${index}`;
            if (todoItems[index].completed === "true") { //If the list item is marked as completed
                input_checkbox.checked = "true"; //checkbox:checked
                ThemeChecker(input_text); //style the completed text with a line-through and specific color based on theme
                listItem.classList.add("completed"); //mark as completed with class
            }


            input_checkbox.classList.add("gradient-border");/*Add some classes*/
            listItem.classList.add("custom");
            input_text.classList.add("inputs");

            input_text.type = "text";
            input_text.name = `close-${index}`;
            input_text.value = `${item.text}`; //The input gets the current item's text

            crossImg.src = "./images/icon-cross.svg"; //Append X image button
            crossImg.id = `close-${index}`;
            listItem.appendChild(input_checkbox);/*Append the checkbox, input text and X button*/
            listItem.appendChild(input_text);
            listItem.appendChild(crossImg);


            input_checkbox.addEventListener('click', function completeCheckbox() { //Mark as completed/uncompleted checkbox functionality
                input_checkbox.checked = true; //Check
                listItem.classList.add("completed"); //Mark as completed
                ThemeChecker(input_text); //Style the text with strikethrough and specific color based on theme
                completedTasksArray.push(input_text.value); //Push into completed tasks array
                updateTheNumberOfItemsLeft(numberOfItemsLeft); //Update the number of items left
                input_checkbox.removeEventListener('click', completeCheckbox); //Remove this event 

                input_checkbox.addEventListener('click', function uncompleteCheckBox() {//Add the off functionality
                    input_checkbox.checked = false; //Unchecked
                    listItem.classList.remove("completed"); //Remove the completed class
                    input_text.style = "text-decoration: none"; //No decoration

                    let indexOfCompletedItem = completedTasksArray.indexOf(`${input_text.value}`); //Index of completed item
                    if (indexOfCompletedItem != -1) {
                        completedTasksArray.splice(indexOfCompletedItem, 1); //Remove from completed array
                        updateTheNumberOfItemsLeft(numberOfItemsLeft); //Update the number of items left
                    }
                    input_checkbox.addEventListener('click', completeCheckbox); //Add the mark as completed functionality back
                })
            })

            listItem.classList.add("create-todo");/*Add some classes*/
            listItem.classList.add("d-flex");
            listItem.draggable = "true"; //Make it draggable
            toDoList.appendChild(listItem); //Append list item
            crossImg.addEventListener("click", function () { deleteToDoNew(toDoList, listItem, newToDoArray, completedTasksArray, input_text, index) }, false); //Add X button remove functionality

        })


        gradientCheckboxBorder(); //Add gradient border to checkboxes
        updateTheNumberOfItemsLeft(numberOfItemsLeft); //Update number of items
    }


    else if (demoArray !== null) { //Use the demo items if there is no other list stored in LocalStorage
        demoArray.forEach((item, index) => {
            const listItem = document.createElement("LI");//Create items
            const input_checkbox = document.createElement("input");
            const input_text = document.createElement("input");
            const crossImg = document.createElement("img");
            const class1 = "demo";
            const class2 = "inputs";

            createTheListItem(listItem, input_checkbox, input_text, index, item, crossImg, class1, class2); //Create the list item

            input_checkbox.addEventListener('click', function completeCheckbox() {//Checked function
                input_checkbox.checked = true;
                elementClicked = true;
                listItem.classList.add("completed");
                ThemeChecker(input_text);
                completedTasksArray.push(input_text.value);
                updateTheNumberOfItemsLeft(numberOfItemsLeft);
                input_checkbox.removeEventListener('click', completeCheckbox);

                input_checkbox.addEventListener('click', function uncompleteCheckBox() { //nested event listener for toggling functionality
                    input_checkbox.checked = false;
                    elementClicked = false;
                    listItem.classList.remove("completed");
                    input_text.style = "text-decoration: none";
                    let indexOfCompletedItem = completedTasksArray.indexOf(`${input_text.value}`);
                    if (indexOfCompletedItem != -1) {
                        completedTasksArray.splice(indexOfCompletedItem, 1);
                        updateTheNumberOfItemsLeft(numberOfItemsLeft);


                    }
                    input_checkbox.addEventListener('click', completeCheckbox);
                })
            })

            listItem.classList.add("create-todo");//Add some classes
            listItem.classList.add("d-flex");
            listItem.draggable = "true";//Make the list item draggable
            toDoList.appendChild(listItem);//Apend list item

            crossImg.addEventListener('click', function () { deleteToDo(toDoList, listItem, demoArray, completedTasksArray, input_text) }, false); //Add functionality to X button
        })
    }
    gradientCheckboxBorder(); //Gradient checkbox border on hover
    updateTheNumberOfItemsLeft(numberOfItemsLeft);//Update no of items left
    let drag_and_drop = new Sortable(sortablelist, { //Create new Sortable
        animation: 150,
        ghostClass: "sortable-ghost"
    })
}





const mainCheck = (theValueToBeInserted, listI, todoIndex, input_check, input_text) => {//This is called whenever a task is inserted togheter with the completed checkbox
    if (theValueToBeInserted.value != '' && create_todo_text_check.checked === true) {

        completedTasksArray.push(theValueToBeInserted.value); //Push into completed array
        listI.id = `list-${newToDoArray.length}`;
        listI.draggable = true;
        input_check.type = "checkbox";
        input_check.checked = "true";
        input_check.id = `checkbox-${newToDoArray.length}`;
        listI.appendChild(input_check); //Append checkbox
        input_text.type = "text";
        input_text.value = `${newToDoArray[todoIndex]}`;
        ThemeChecker(input_text); //Style the text accordingly to theme
        listI.classList.add("completed-new");
        listI.appendChild(input_text); //Append text
        newToDoArray.pop(); //Pop


        input_check.addEventListener('click', function uncompleteCheckBox() {//Unchecked
            input_check.checked = false;
            input_text.style = "text-decoration: none";
            listI.classList.remove("completed-new");
            let indexOfCompletedItem = completedTasksArray.indexOf(`${input_text.value}`);
            if (indexOfCompletedItem != -1) {
                completedTasksArray.splice(indexOfCompletedItem, 1);
                newToDoArray.push(input_text.value);
                updateTheNumberOfItemsLeft(numberOfItemsLeft);
            }

            input_check.removeEventListener('click', uncompleteCheckBox); //Remove the unchecked function

            input_check.addEventListener('click', function completeCheckbox() { //Checked
                input_check.checked = true;
                ThemeChecker(input_text); //Line-through and color according to theme on text
                listI.classList.add("completed-new");
                completedTasksArray.push(input_text.value);
                newToDoArray.splice(newToDoArray.indexOf(`${input_text.value}`));
                updateTheNumberOfItemsLeft(numberOfItemsLeft);


                input_check.addEventListener('click', uncompleteCheckBox);

            })

        })
        gradientCheckboxBorder();
    }
}

/*Insert todo task functionality*/
const onInsert = () => {

    if (toDoTextInsert.value != '') { //If input is not empty on Enter
        newToDoArray.push(toDoTextInsert.value); //Insert value into newToDoArray

        const newToDoIndex = newToDoArray.length - 1; //index starts at 0
        const listItem = document.createElement("LI");
        const input_checkbox = document.createElement("input");
        const input_text = document.createElement("input");
        const crossImg = document.createElement("img");

        listItem.draggable = true;
        listItem.id = `list-${newToDoArray.length}`;
        listItem.classList.add("uncompleted");
        input_checkbox.type = "checkbox";
        input_checkbox.id = `checkbox-${newToDoArray.length}`;
        listItem.appendChild(input_checkbox); //Add the checkbox

        input_text.name = `input-new`;
        input_text.type = "text";
        input_text.value = `${newToDoArray[newToDoIndex]}`;
        input_text.classList.add("inputs");
        listItem.appendChild(input_text);//Add the input text

 

        mainCheck(toDoTextInsert, listItem, newToDoIndex, input_checkbox, input_text); //Check if the task was checked as completed from the insert div

       crossImg.src = "./images/icon-cross.svg";
        crossImg.id = `close-${newToDoArray.length}`;
        listItem.appendChild(crossImg);//append X button

        //X button functionality
        crossImg.addEventListener('click', function () {deleteToDo(toDoList, listItem, demoArray, completedTasksArray, input_text, newToDoIndex)});

        //Checkbox functionality//
        input_checkbox.addEventListener('click', function completeCheckbox() { //CHECKED
            input_checkbox.checked = true;
            elementClickedNew = true;
            ThemeChecker(input_text);
            listItem.classList.add("completed-new");
            completedTasksArray.push(input_text.value);
            updateTheNumberOfItemsLeft(numberOfItemsLeft);

            input_checkbox.removeEventListener('click', completeCheckbox); //Remove the CHECKED function

            input_checkbox.addEventListener('click', function uncompleteCheckBox() { //Add the UNCHECKED event listener
                input_checkbox.checked = false;
                elementClickedNew = false;
                input_text.style = "text-decoration: none;"
                if (main.classList.contains("light-theme")) { //If the light theme is on
                    input_text.style.color = "var(--light-theme-light-grayish-blue);"; //change the input text accordingly

                } else {
                    input_text.style.color = "var(--dark-theme-vdark-grayish-blue);";
                }
                listItem.classList.remove("completed-new"); //remove class
                let indexOfCompletedItem = completedTasksArray.indexOf(`${input_text.value}`);
                if (indexOfCompletedItem != -1) {
                    completedTasksArray.splice(indexOfCompletedItem, 1); //remove from completed array
                    updateTheNumberOfItemsLeft(numberOfItemsLeft); //Update no of items

                }

                input_checkbox.addEventListener('click', completeCheckbox); //Add the CHECKED function back
            })



        })
        //Checkbox functionality



        listItem.classList.add("create-todo");
        listItem.classList.add("d-flex");
       /* input_checkbox.classList.add("gradient-border"); /*Add some classes*/
        toDoList.appendChild(listItem); //Append the list item to the unordered list


        toDoTextInsert.value = ''; //Clear the main input
        create_todo_text_check.checked = false; //Uncheck
        toDoTextInsert.focus(); //Focus the main input again
        updateTheNumberOfItemsLeft(numberOfItemsLeft);  //Update no of items

        if (minMediaQueryCrossImagesHover.matches) {//If the viewport width is greater than 1080px
            listItemHoverCross(); //Add dynamic X buttons on hover

        } else if (maxMediaQueryCrossImagesHover.matches) {//If the viewport width is lesser than 1079px
            defaultListItemCross(); //Static X buttons on hover
        }

        gradientCheckboxBorder(); //add gradient border on checkbox:hover

    }
}





/*List item creation*/
const createTheListItem = (listItem, checkbox, text, index, item, crossImg, class1, class2) => {
    checkbox.type = "checkbox";
    checkbox.id = `checkbox-${index}`;
    checkbox.classList.add("gradient-border");
    listItem.appendChild(checkbox);
    listItem.classList.add(`${class1}`);
    text.type = "text";
    text.name = `close-${index}`;
    text.classList.add(`${class2}`);
    text.value = `${item}`;
    listItem.appendChild(text);
    crossImg.src = "./images/icon-cross.svg";
    crossImg.id = `close-${index}`;
    listItem.appendChild(crossImg);
}


/*Delete demo/default items through cross image*/
function deleteToDo(todo, listitem, demoarr, completedarr, text, index) {
    todo.removeChild(listitem);
    demoarr.splice(index, 1);
    completedarr.splice(index, 1);
    updateTheNumberOfItemsLeft(numberOfItemsLeft);
};

/*Delete new/custom items through cross image*/
function deleteToDoNew(todo, listitem, newarr, completedarr, text, index) {
    todo.removeChild(listitem);
    newarr.splice(index, 1);
    completedarr.splice(index, 1);
    updateTheNumberOfItemsLeft(numberOfItemsLeft);
}

/*Number of items left*/
const updateTheNumberOfItemsLeft = (noOfItems) => {
    const li_demo = document.querySelectorAll("li.demo");
    const li_uncompleted = document.querySelectorAll("li.uncompleted");
    const li_completed = document.querySelectorAll("li.completed");
    const li_completed_new = document.querySelectorAll("li.completed-new");
    const li_demo_items = document.querySelectorAll("li.custom");
    noOfItems.textContent = li_demo.length + li_demo_items.length + li_uncompleted.length - li_completed.length - li_completed_new.length;

}


/*Unfortunately there is no simple way to select ::before or ::after pseudo-elements, it is possible to do it through CSS variables
This function  plays with the visibility variable property of the gradient checkbox border while hovering
*/
const gradientCheckboxBorder = () => {
    const gradient_borders = document.querySelectorAll(".gradient-border");
    gradient_borders.forEach(elem => {
        elem.addEventListener('mouseover', () => {
            elem.style.setProperty('--visibility', 'visible');
        })

        elem.addEventListener('mouseleave', () => {
            elem.style.setProperty('--visibility', 'hidden');
        })
    })
}

/*Default static cross images (for mobile)*/
const defaultListItemCross = () => {
    const li = document.querySelectorAll("li");
    const crossImages = document.querySelectorAll("li > img");
    li.forEach((elem, index) => {
        crossImages[index].style = "visibility: visible";

    })

}


/*Show/unshow cross images while hovering (for desktop)*/
const listItemHoverCross = () => {
    const li = document.querySelectorAll("li");
    const crossImages = document.querySelectorAll("li > img");
    li.forEach((elem, index) => {
        elem.addEventListener('mouseenter', () => {
            crossImages[index].style = "visibility: visible";
        })

        elem.addEventListener('mouseleave', () => {
            crossImages[index].style = "visibility: hidden";
        })
    })

}




const maxMediaQueryBgImage = window.matchMedia("(max-width: 699px)");//Main header bg image max media query
const minMediaQueryBgImage = window.matchMedia("(min-width: 700px)");//Main header bg image min media query

const themeBtn = document.querySelector('.themeBtn'); //Theme button(icon)
const currentTheme = localStorage.getItem('currentTheme'); //Current theme item in localStorage for theme remembering
const mainImage = document.querySelector("#main-background"); //Main header image


/*Change header image based on theme preference and viewport size*/
const adaptiveImage = () => {
    if (main.classList.contains('light-theme') && maxMediaQueryBgImage.matches) {
        mainImage.src = "./images/bg-mobile-light.jpg";


    } else if (main.classList.contains("light-theme") && minMediaQueryBgImage.matches) {
        mainImage.src = "./images/bg-desktop-light.jpg";


    } else if (!main.classList.contains("light-theme") && maxMediaQueryBgImage.matches) {
        mainImage.src = "./images/bg-mobile-dark.jpg";


    } else if (!main.classList.contains("light-theme") && minMediaQueryBgImage.matches) {
        mainImage.src = "./images/bg-desktop-dark.jpg";
    }
    main.style = "transition: .3s ease-in-out background-color"; //add a little transition on main while switching themes
}



/*Theme checker for input text styling*/
const ThemeChecker = (text) => {
    if (main.classList.contains("light-theme")) {

        text.style = "text-decoration: line-through; color: var(--light-theme-light-grayish-blue);";

    } else {
        text.style = "text-decoration: line-through; color: var(--dark-theme-vdark-grayish-blue);";
    }
}





/*///////////////Menu buttons functionality///////////////////*/
const all = document.querySelectorAll(".all");
const active_button = document.querySelectorAll(".active_button");
const completed_button = document.querySelectorAll(".completed_button");



/*Show all the items*/
const showAll = () => {
    const li_completed = Array.from(document.querySelectorAll("li.completed"));
    const li_completed_new = Array.from(document.querySelectorAll("li.completed-new"))
    const li_demo = Array.from(document.querySelectorAll("li.demo"));
    const uncompleted = Array.from(document.querySelectorAll("li.uncompleted"));
    const li_custom = Array.from(document.querySelectorAll("li.custom"));


    if (li_custom != 'undefined') {
        li_custom.forEach(item => {
            item.style = "display: flex;";
        })
    }

    all.forEach(elem => {
        elem.style = "color: var(--primary-blue); font-weight: 700";
    })




    li_completed.forEach(item => {
        item.style.display = "flex";
    })


    if (li_completed_new) {
        li_completed_new.forEach(elem => {
            elem.style.display = "flex";
        })
    }

    li_demo.forEach(li_demo_items => {
        li_demo_items.style = "display: flex";
    })

    uncompleted.forEach(elem => {
        elem.style = "display: flex";
    })
    active_button.forEach(elem => {
        elem.style.color = "inherit";
        elem.style = "font-weight: 700;"
    })


    completed_button.forEach(elem => {
        elem.style.color = "inherit";
        elem.style = "font-weight: 700;";
    })

}



/*Show only active items*/
const showActiveItems = () => {
    const li_completed_hide = Array.from(document.querySelectorAll("li.completed"));
    const li_completed_new_hide = Array.from(document.querySelectorAll("li.completed-new"));
    const li_custom = Array.from(document.querySelectorAll("li.custom"));
    const li_uncompleted = Array.from(document.querySelectorAll("li.uncompleted"));
    const li_demo = Array.from(document.querySelectorAll("li.demo"));
    li_custom.forEach((elem, index) => {
        if (!li_custom[index].classList.contains("completed")) {
            elem.style = "display: flex";
        }
    })

    li_demo.forEach((elem, index) => {
        if (!li_demo[index].classList.contains("completed")) {
            elem.style = "display: flex";
        }
    })

    li_uncompleted.forEach(elem => {
        elem.style = "display: flex;";
    })


    for (let item of li_completed_hide) {
        item.style = "display: none";
    }

    if (li_completed_new_hide) {
        for (let item2 of li_completed_new_hide) {
            item2.style = "display: none";
        }
    }

    completed_button.forEach(elem => {
        elem.style.color = "inherit";
    })


    active_button.forEach(elem => {

        elem.style.color = "var(--primary-blue)";
    })


    all.forEach(elem => {
        elem.style.color = "inherit";
    })

}



/*Show only completed items*/
const showCompletedItemsList = () => {
    const li_demo = Array.from(document.querySelectorAll("li.demo"));
    const li_custom = Array.from(document.querySelectorAll("li.custom"));
    const uncompleted = Array.from(document.querySelectorAll("li.uncompleted"));
    const li_completed = Array.from(document.querySelectorAll("li.completed"));
    const li_completed_new = Array.from(document.querySelectorAll("li.completed-new"));
    if (li_custom != 'undefined') {
        li_custom.forEach(elem => {
            elem.style = "display: none";
        })
    }
    li_demo.forEach((elem) => {
        elem.style = "display: none";
    })

    uncompleted.forEach(elem => {
        elem.style = "display:none";
    })

    li_completed.forEach(elem => {
        elem.style = "display: flex;";

    })
    li_completed_new.forEach(elem => {
        elem.style = "display: flex";
    })
    completed_button.forEach(elem => {
        elem.style = "color: var(--primary-blue); font-weight: 700;";
    })

    all.forEach(elem => {
        elem.style.color = "inherit";
    })
    active_button.forEach(elem => {
        elem.style.color = "inherit";
    })

}



/*Clear completed items*/
clear_completed.addEventListener('click', () => {
    let theListItems = Array.from(document.querySelectorAll("#sortablelist > li"));
    let theInputs = Array.from(document.querySelectorAll(".create-todo > input[type='text']"));
    for (let i = 0; i < theInputs.length; i++) { //For loop for demo array
        if (theListItems[i].classList.contains("completed") === true) { //If the li contains completed
            demoArray.splice(theInputs.indexOf(theInputs[i].value)); //Remove from demo array
            completedTasksArray.splice(theInputs.indexOf(theInputs[i].value));//Remove from completed array
            toDoList.removeChild(theListItems[i]);//Remove item
        }
    }

    for (let d = 0; d < theListItems.length; d++) {//For loop for new array
        if (theListItems[d].classList.contains("completed-new") === true) { //If the li contains completed-new

            newToDoArray.splice(theListItems.indexOf(theInputs[d]), 1); //Remove from new array
            completedTasksArray.splice(theListItems.indexOf(theInputs[d]), 1); //Remove from completed array
            toDoList.removeChild(theListItems[d]);//Remove item
        }
    }
    updateTheNumberOfItemsLeft(numberOfItemsLeft);//Update no of items left

});


/*///////////////Menu buttons functionality///////////////////*/







//Event listeners//
window.addEventListener('DOMContentLoaded', initialLoad); //Initial load
window.addEventListener('DOMContentLoaded', showAll); //Automatically select the "All" menu button
window.addEventListener('DOMContentLoaded', adaptiveImage); //Adaptive image on load
window.addEventListener('resize', adaptiveImage); //Adaptive image on resize

/*Add the hover effect or show static cross images based on viewport on load*/
window.addEventListener('DOMContentLoaded', () => {
    if (minMediaQueryCrossImagesHover.matches) {
        listItemHoverCross();
    } else if (maxMediaQueryCrossImagesHover.matches) {
        defaultListItemCross();
    }
})



// Check to see if there is a theme preference in local Storage, if so add the light theme to the body
window.addEventListener('DOMContentLoaded', () => {
    if (currentTheme) {
        main.classList.add('light-theme');
        themeBtn.src = "./images/icon-moon.svg";
        mainImage.src = "./images/bg-desktop-light.jpg";
    }
})


themeBtn.addEventListener('click', function () {
    // Add light theme on click
    main.classList.toggle('light-theme'); //switch to light theme
    themeBtn.src = "./images/icon-moon.svg"; //add moon icon
    adaptiveImage(); //change image based on theme

    // If the body has the class of light theme then add it to local Storage, if not remove it
    if (main.classList.contains('light-theme')) {
        window.localStorage.setItem('currentTheme', 'themeActive');
    } else {
        window.localStorage.removeItem('currentTheme');
        themeBtn.src = "./images/icon-sun.svg";
        adaptiveImage();
    }
});



/*Tasks insert on Enter keyup event*/
toDoTextInsert.addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        onInsert();
    }
});



/*Text insert checkbox functionality*/
create_todo_text_check.addEventListener('click', function check() {
    create_todo_text_check.checked = true;
    create_todo_text_check.removeEventListener('click', check);

    create_todo_text_check.addEventListener('click', function uncheck() {
        create_todo_text_check.checked = false;
        create_todo_text_check.removeEventListener('click', uncheck);
        create_todo_text_check.addEventListener('click', check);
    })
})


/*Add event listeners to menu buttons*/
all.forEach(elem => {
    elem.addEventListener('click', showAll);
})

active_button.forEach(elem => {
    elem.addEventListener('click', showActiveItems);
})

completed_button.forEach(elem => {
    elem.addEventListener('click', showCompletedItemsList);
})



/*Save the list when the user exits/refreshes the tab/browser*/
window.addEventListener("beforeunload", () => {
    const allTheItems = document.querySelectorAll("li"); //Select the list items
    const thesmallinputs = document.querySelectorAll(".inputs"); //Selec the inputs containing the tasks text
    let jsonItemsArr = [];//empty array

    class jsonItems {
        constructor(text, index, completed, checked) {
            this.text = text;
            this.index = index;
            this.completed = completed;
            this.checked = checked;
        }
    }

    allTheItems.forEach((item, index) => {//For each list item
        let items = new jsonItems(thesmallinputs[index].value, index, item.checked);//Create a new object
        if (item.classList.contains("completed") || item.classList.contains("completed-new")) {//If the item has the class completed or completed-new
            items.completed = "true"; //Set as completed
            items.checked = "true"; //Set as checked
        }


        jsonItemsArr.push(items); //Push the item into JSON array
        window.localStorage.setItem('theList', JSON.stringify(jsonItemsArr)); //Save the list in LocalStorage
    })

})
