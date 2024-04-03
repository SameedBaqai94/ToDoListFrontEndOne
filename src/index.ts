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
    headers: Record<string, string>,
    body: string
}
interface IMain {
    _getList: () => Promise<string[]>
    _addList: (formObj: ToDoList) => boolean;
    getList: () => void;
    addList: (formData: FormData) => void;
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
    //Public Functions
    //controllers
    this.getList = async function () {
        const data: ToDoList[] = await _getList();
        const listContainer = document.getElementById("listsContainer") as HTMLDivElement;
        //listContainer.textContent = data.title;
        data.forEach(element => {
            const h2 = document.createElement("h2") as HTMLHeadElement;
            h2.textContent = element.title;
            listContainer.appendChild(h2);
        });
    }

    this.addList = function (formData: FormData) {
        const formObj: ToDoList = {
            title: "",
            items: []
        }

        formData.forEach((val) => { formObj.title = val.toString(); })
        console.log(formObj);
        if (!_addList(formObj)) {
            console.log("Something went wrong");
        }
        console.log("List added");
        window.location.reload();
    }
}
document.addEventListener("DOMContentLoaded", function () {
    let App: IMain = new (Main as any)();
    const form = document.getElementById("listForm") as HTMLFormElement;
    App.getList();

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const formData = new FormData(form);
        App.addList(formData);

    })
});

