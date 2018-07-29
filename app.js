// storage controller

const StorageCtrl = (function(){


})();

// item controller
const ItemCtrl = (function(){
  const Item = function(id, name, calories ) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  const data = {
    
    items : [
      // {id: 0, name: "Мясо", calories: 1000},
      // {id: 1, name: "Печенье", calories: 1300},
      // {id: 2, name: "Яица", calories: 700}
    ],
    currentItem : null,
    totalCalories : 0
  }

  return {
    logData: function() {
      return data
    },
    addItem: function(name, calories) {
      let id;
      if(data.items.length !== 0) {
        id = +(data.items.length - 1) + 1
      } else {
        id = 0;
      }
      const item = new Item(id, name, parseInt(calories));


      data.items.push(item);

      return item;
    },
    getItems: function() {
      return data.items
    },
    getTotalCalories: function() {
      // get total calories
      let totalCalories = 0;

      data.items.forEach(item => {
        totalCalories += item.calories;
      })

      data.totalCalories = totalCalories;

      return totalCalories;      
    },
    setCurrentItem: function(itemCurrent) {
      
      data.currentItem = itemCurrent;
    },
    getCurrentValue: function() {
      return data.currentItem
    },
    getItemById: function(id) {
      let currentItem = null;

      data.items.filter(item => {
      
        if(id === item.id) {
          currentItem = item
        }

      })
      
      return currentItem;
    }
  }
})();

//UI contoller
const UICtrl = (function(){
  const UISelector = {
    itemList : "#item-list",
    btnAdd: ".add-btn",
    form: '#form',
    name: "#item-name",
    calories: "#item-calories", 
    totalCalories: ".total-calories",
    btnDelete: ".delete-btn",
    btnUpdate: ".update-btn",
    btnBack: ".back-btn"
  }

  return {
    populateItemList : function(items) {
      let html = '';
       
        items.forEach(item => {
          
          
          html += `  
            <li class="collection-item" id="item-${item.id}">
              <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
              <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
              </a>
            </li>
          `
      });

      document.querySelector(UISelector.itemList).innerHTML = html;
    },
    getItemInput : function() {
      return {
        name: document.querySelector(UISelector.name).value,
        calories: document.querySelector(UISelector.calories).value
      }
    },
    getSelector: function() {
      return UISelector;
    },
    addListItem: function(item) {
      // show list
      document.querySelector(UISelector.itemList).style.display = 'block'; 
      // create li element 
      const li = document.createElement('li');
      li.className = 'collection-item';
      li.id = `item-${item.id}`;

      li.innerHTML = `
        <strong>${item.name}: </strong> <em>${item.calories} калорий</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      `;

      //insert item 
      document.querySelector(UISelector.itemList).insertAdjacentElement('beforeend', li)

    },
    addItemToForm: function() {
    
      document.querySelector(UISelector.name).value = ItemCtrl.getCurrentValue().name;
      document.querySelector(UISelector.calories).value = ItemCtrl.getCurrentValue().calories;

      this.showEditState();
    },
    clearFields: function() {
      document.querySelector(UISelector.name).value = '';
      document.querySelector(UISelector.calories).value = '';
    },
    hideList: function() {
      document.querySelector(UISelector.itemList).style.display = 'none';
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(UISelector.totalCalories).textContent = totalCalories;
    },
    clearEditState: function() {
  
      this.clearFields();

      document.querySelector(UISelector.btnDelete).style.display = "none";
      document.querySelector(UISelector.btnBack).style.display = "none";
      document.querySelector(UISelector.btnUpdate).style.display = "none";
      document.querySelector(UISelector.btnAdd).style.display = "inline";

    },

    showEditState: function () {

      document.querySelector(UISelector.btnDelete).style.display = "inline";
      document.querySelector(UISelector.btnBack).style.display = "inline";
      document.querySelector(UISelector.btnUpdate).style.display = "inline";
      document.querySelector(UISelector.btnAdd).style.display = "none";

    }
  }
})();

//App controller
const App = (function(ItemCtrl, UICtrl){

  const UIselector = UICtrl.getSelector();
  const loadEventListener = function() {

    document.querySelector(UIselector.form).addEventListener('submit', itemAddSubmit);

    document.querySelector(UIselector.itemList).addEventListener('click', submitToForm);

  
  }

  const itemAddSubmit = function(e) {
    e.preventDefault();
    const input = UICtrl.getItemInput();

    
    if(input.name !== '' && input.calories !== '' && !isNaN(+(input.calories))) {
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      UICtrl.addListItem(newItem);

      // clear fields
      UICtrl.clearFields();

      const totalCalories = ItemCtrl.getTotalCalories();
      // show total calories
      UICtrl.showTotalCalories(totalCalories)
    }
  
  }

  const submitToForm = function(e) {
    e.preventDefault
    if (e.target.classList.contains('edit-item')) {
      
      const currentItemId = e.target.parentNode.parentNode.id;
      
      const itemIdArr = currentItemId.split('-');

      const id = parseInt(itemIdArr[1]);
      
      const itemToEdit = ItemCtrl.getItemById(id)

      ItemCtrl.setCurrentItem(itemToEdit);

      UICtrl.addItemToForm();
    }

  }

  // public method
  return {
    init: function() {
      const items = ItemCtrl.getItems();
      
      //hide btn state 
      UICtrl.clearEditState();

      loadEventListener()

      if(items.length === 0) {
        UICtrl.hideList()
      } else {
        UICtrl.populateItemList(items)

      }

      const totalCalories = ItemCtrl.getTotalCalories();
      // show total calories
      UICtrl.showTotalCalories(totalCalories);

    }
  }
})(ItemCtrl, UICtrl);
// item controller 

// init app
App.init()


