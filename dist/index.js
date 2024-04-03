"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function Main() {
    function getList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch("http://localhost:8080/api/ToDoList/GetList");
                if (!response.ok) {
                    throw new Error;
                }
                const data = yield response.json();
                return data;
            }
            catch (error) {
                console.log(`something went wrong with fetching ${error}`);
            }
        });
    }
    function addList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch("http://localhost:8080/api/ToDoList/AddList");
                if (!response.ok) {
                    throw new Error;
                }
            }
            catch (error) {
            }
        });
    }
    this.getInfo = function () {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield getList();
            console.log(data);
        });
    };
}
let App = new Main();
App.getInfo();
