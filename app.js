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
      let lastItem = data.items.length - 1;
      if(data.items.length !== 0) {
        
        id = parseInt(data.items[lastItem].id) + 1
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
    getUpdateItem: function (name, calories) {
      

      let found = data.items.filter(item => {
        if(item.id === data.currentItem.id) {
          item.name = name;
          item.calories = parseInt(calories);  
          return item;
        }
      })

      return found;

    },
    deleteItem: function(id) {
      let index;
      data.items.forEach((item, itemIndex) => {
        if(item.id == id) {
          index = itemIndex
        }
      });
      data.items.splice(index, 1);
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
    item : "#item-list li",
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
    updateItemList: function(itemUpdate) {
      const items = Array.from(document.querySelectorAll(UISelector.item));
      
      items.forEach(item => {
        itemId = item.getAttribute('id');
       

        if (itemId === `item-${itemUpdate.id}`) {
          
          document.querySelector(`#${itemId}`).innerHTML = `
        <strong>${itemUpdate.name}: </strong> <em>${itemUpdate.calories} калорий</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>`
        }
      })
      
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(UISelector.totalCalories).textContent = totalCalories;
    },
    deleteItemList: function(id){
      document.querySelector(`#item-${id}`).remove();

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
    // add item to list
    document.querySelector(UIselector.form).addEventListener('submit', itemAddSubmit);
    // submit item to form
    document.querySelector(UIselector.itemList).addEventListener('click', clickItemEdit);
    // update item 
    document.querySelector(UIselector.btnUpdate).addEventListener('click', updateItemEdit);
    // back edit
    document.querySelector(UIselector.btnBack).addEventListener('click', backItemEdit);
    // delete item
    document.querySelector(UIselector.btnDelete).addEventListener('click', deleteItemEdit);
  
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
  // click edit item
  const clickItemEdit = function(e) {
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
  //update item 
  const updateItemEdit = function(e) {
    e.preventDefault();
    
    const input = UICtrl.getItemInput();

    const updateItem = ItemCtrl.getUpdateItem(input.name, input.calories);
    
    UICtrl.updateItemList(...updateItem)

    const totalCalories = ItemCtrl.getTotalCalories();
    // show total calories
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();
    return false;
  }

  // back item edit 

  const backItemEdit = function(e) {
    e.preventDefault(); 

    UICtrl.clearEditState();
  }

  // delete item 

  const deleteItemEdit = function(e) {
    e.preventDefault();

    const idCurrentItem = ItemCtrl.getCurrentValue().id;

    ItemCtrl.deleteItem(idCurrentItem); 

    UICtrl.deleteItemList(idCurrentItem);

    // show total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();
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


