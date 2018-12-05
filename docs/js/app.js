import {MainViewModel} from "./mainVM.js"
import {MainViewController} from "./mainVC.js"

ko.applyBindings(new MainViewModel());
new MainViewController();