interface ToDoList {
    title: string,
    items?: Item[]
}
interface Item {
    description: string,
    status: string
}
interface RequestOption {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    headers?: Record<string, string>,
    body?: string
}
interface IMain {
    _getList: () => Promise<string[]>
    _addList: (formObj: ToDoList) => boolean;
    _addItem: (itemObj: Item) => boolean;
    getList: () => void;
    addList: (formData: FormData) => void;
    addItem: (itemFormData: FormData) => void;
}

function Main(this: IMain) {
    //private functions
    //repositories
    async function _getList() {
        try {
            const response = await fetch("http://localhost:8080/api/ToDoList/GetList");
            if (!response.ok) {
                throw new Error;
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.log(`something went wrong with fetching GET ${error}`);
        }
    }
    async function _addList(formObj: ToDoList) {
        const requestOptions: RequestOption = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formObj)
        }
        try {
            const response = await fetch("http://localhost:8080/api/ToDoList/AddList", requestOptions);
            if (!response.ok) {
                return false;
            }
            return true
        } catch (error) {
            return false;
        }
    }
    async function _addItem(itemObj: Item) {
        const requestOptions: RequestOption = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(itemObj)
        }
        try {
            const response = await fetch("http://localhost:8080/api/Items/AddItem?todolistid=1", requestOptions);
            if (!response.ok) {
                return false;
            }
            return true
        } catch (error) {
            return false;
        }
    }

    //Public Functions
    //controllers
    this.getList = async function () {
        const data: ToDoList[] = await _getList();
        const listTemplate = document.getElementById("listTemplate") as HTMLDivElement;
        //listContainer.textContent = data.title;
        data.forEach(element => {
            if (element.title != "") {
                const list = document.createElement('div') as HTMLDivElement;
                list.setAttribute("class", "list");
                const h2 = document.createElement("h2") as HTMLHeadElement;
                h2.setAttribute("class", "list-title");
                const ul = document.createElement("ul") as HTMLUListElement;
                ul.setAttribute("class", "items");
                const form = document.createElement("form") as HTMLFormElement;
                form.setAttribute("class", "itemForm");
                const input = document.createElement("input") as HTMLInputElement;
                input.type = "text";
                input.name = "description";
                input.setAttribute("class", "itemInput");
                input.placeholder = "Add new item...";
                const button = document.createElement("button") as HTMLButtonElement;
                button.type = "submit";
                button.textContent = "Submit";

                h2.textContent = element.title;
                form.appendChild(input);
                form.appendChild(button);
                list.appendChild(h2);
                list.appendChild(ul);
                list.appendChild(form);
                listTemplate.appendChild(list);
            }

        });
    }

    this.addList = function (formData: FormData) {
        const formObj: ToDoList = {
            title: ""
        }

        formData.forEach((val) => { formObj.title = val.toString(); })
        console.log(formObj);
        if (!_addList(formObj)) {
            console.log("Something went wrong");
        }
        console.log("List added");
        //window.location.reload();
    }
    this.addItem = function (itemFormData: FormData) {
        const itemObj: Item = {
            description: "",
            status: ""
        }
        itemFormData.forEach((element) => {
            itemObj.description = element.toString();
            itemObj.status = "inactive";
        })
        console.log(itemObj);
        if (!_addItem(itemObj)) {
            console.log("Something went wrong");
        }
        console.log("Item added");
    }
}


function domContentLoadedPromise() {
    return new Promise<void>((resolve) => {
        if (document.readyState == "complete") {
            resolve();
        } else {
            document.addEventListener('DOMContentLoaded', () => resolve());
        }
    })
}
function dynamicLoadedPromise(selector: string): Promise<HTMLFormElement> {
    return new Promise<HTMLFormElement>((resolve) => {
        const eventListener = (event: Event) => {
            event.preventDefault();
            const target = event.target as HTMLFormElement;
            if (target.matches(selector)) {
                resolve(target);
            }
        };
        document.addEventListener('submit', eventListener);
    })
}

const App: IMain = new (Main as any)();
domContentLoadedPromise().then(() => {

    const listForm = document.getElementById("listForm") as HTMLFormElement;

    App.getList();

    listForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const formData = new FormData(listForm);
        console.log(formData);
        App.addList(formData);
    });
    return dynamicLoadedPromise(".itemForm");

}).then((clickedElement) => {
    console.log('Clicked element:', clickedElement);
    const itemData = new FormData(clickedElement);
    console.log(itemData);
    App.addItem(itemData);
})

