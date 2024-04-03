interface ToDoList {
    title: string,
    items: Item[]
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
    getList: () => Promise<string[]>
    addList: () => void;
    getInfo: () => void;
}
function Main(this: IMain) {
    async function getList() {
        try {
            const response = await fetch("http://localhost:8080/api/ToDoList/GetList");
            if (!response.ok) {
                throw new Error;
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.log(`something went wrong with fetching ${error}`);
        }
    }
    async function addList() {
        try {
            const response = await fetch("http://localhost:8080/api/ToDoList/AddList");
            if (!response.ok) {
                throw new Error;
            }
        } catch (error) {

        }
    }
    this.getInfo = async function () {
        const data = await getList();
        console.log(data);
    }
}
let App: IMain = new (Main as any)();
App.getInfo();

