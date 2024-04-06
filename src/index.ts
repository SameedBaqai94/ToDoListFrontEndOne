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
    _removeList: () => boolean;
    _getItems: (title: string) => Promise<string[]>
    _addItem: (itemObj: Item, title: string) => boolean;
    getList: () => void;
    getItem: () => Item[];
    addList: (formData: FormData) => void;
    addItem: (itemFormData: FormData, title: string) => boolean;
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
    async function _getItems(title: string) {
        console.log(title);
        const getId = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/ToDoList/GetListId?title=${title}`);
                if (!response.ok) {

                    throw new Error;
                }
                const data = await response.json();
                return data;
            } catch (error) {
                console.log(`something went wrong with fetching GET ${error}`);
            }
        }
        const id = await getId();
        console.log(id.id);
        try {
            console.log(`http://localhost:8080/api/Items/GetItemsByListId?listId=${id.id}`)
            const response = await fetch(`http://localhost:8080/api/Items/GetItemsByListId?listId=${id.id}`);
            if (!response.ok) {
                throw new Error;
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.log(`something went wrong with fetching GET ${error}`);
        }
    }
    async function _addItem(itemObj: Item, title: string) {
        const requestOptions: RequestOption = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(itemObj)
        }
        const getId = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/ToDoList/GetListId?title=${title}`);
                if (!response.ok) {

                    throw new Error;
                }
                const data = await response.json();
                return data;
            } catch (error) {
                console.log(`something went wrong with fetching GET ${error}`);
            }
        }
        const id = await getId();
        try {
            const response = await fetch(`http://localhost:8080/api/Items/AddItem?todolistid=${id.id}`, requestOptions);
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
        //const item: Item[] = await _getItems();
        const listTemplate = document.getElementById("listTemplate") as HTMLDivElement;
        //listContainer.textContent = data.title;
        data.forEach(async (element) => {
            if (element.title != "") {
                const list = document.createElement('div') as HTMLDivElement;
                list.setAttribute("class", "list");
                const h2 = document.createElement("h2") as HTMLHeadElement;
                h2.setAttribute("class", "list-title");
                const ul = document.createElement("ul") as HTMLUListElement;
                ul.setAttribute("class", "items");
                const item: Item[] = await _getItems(element.title);
                item.forEach(e => {
                    const li = document.createElement('li') as HTMLLIElement;
                    li.textContent = e.description;
                    ul.appendChild(li);
                })
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
        if (!_addList(formObj)) {
            console.log("Something went wrong");
        }
        console.log("List added");
        //window.location.reload();
    }

    this.addItem = function (itemFormData: FormData, title: string) {
        const itemObj: Item = {
            description: "",
            status: ""
        }
        itemFormData.forEach((element) => {
            itemObj.description = element.toString();
            itemObj.status = "inactive";
        })

        if (!_addItem(itemObj, title)) {
            console.log("Something went wrong");
            return false;
        }
        console.log("Item added");
        return true;
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

        App.addList(formData);
        setTimeout(() => {
            window.location.reload();
        }, 1000)
    });
    return dynamicLoadedPromise(".itemForm");

}).then((clickedElement) => {
    const itemData = new FormData(clickedElement);
    const title = clickedElement.previousElementSibling?.previousElementSibling as HTMLHeadElement;
    if (title.textContent != null) {
        addToListPromise(itemData, title.textContent).then(() => {
            setTimeout(() => {
                window.location.reload();
            }, 2000)

        })

    }

})

function addToListPromise(itemData: FormData, title: string): Promise<void> {
    return new Promise<void>((resolve) => {
        if (App.addItem(itemData, title)) {
            return resolve();
        }
    })
}