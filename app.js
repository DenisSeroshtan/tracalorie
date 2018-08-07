// storage controller
const StorageCtrl = (function(){
  return {
    setItemsStorage: function(item) {
      let items;
      // add item to localStorage
      if(localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'))
      }

      items.push(item);

      localStorage.setItem('items', JSON.stringify(items))
    },
    getItemsStorage: function() {
      let items;
      // get items from localStorage
      if (localStorage.getItem('items') === null) {
        items = [];

      } else {
        items = JSON.parse(localStorage.getItem('items'))
      }

      return items
    }, 
    updateItemsStorage: function(itemUpdate) {
      let items = JSON.parse(localStorage.getItem("items"));
      const ids = itemUpdate.id;
      items.forEach((item, index) => {
        if(item.id == ids) {
          items.splice(index, 1, itemUpdate)
        }
      })

      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemsStorage: function(id) {
      let items = JSON.parse(localStorage.getItem("items"));
      id = parseInt(id);
      let changeItems = items.filter(item => {
        if (item.id != id) {
          return item
        }
      });

      localStorage.setItem("items", JSON.stringify(changeItems));

    },
    clearStorage() {
      localStorage.clear()
    }

  }

})();

// item controller
const ItemCtrl = (function(){
  const Item = function(id, name, calories ) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  const data = {
    
    items : StorageCtrl.getItemsStorage(), 
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
    },
    clearListItem: function() {
      data.items = [] 
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
    btnBack: ".back-btn",
    btnClear: ".clear-btn"
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

    showEditState: function() {

      document.querySelector(UISelector.btnDelete).style.display = "inline";
      document.querySelector(UISelector.btnBack).style.display = "inline";
      document.querySelector(UISelector.btnUpdate).style.display = "inline";
      document.querySelector(UISelector.btnAdd).style.display = "none";

    },
    clearItems: function() {
      const arrItemList = Array.from(document.querySelectorAll(UISelector.item));

      arrItemList.forEach(item => item.remove())
    }
  }
})();

//App controller
const App = (function(ItemCtrl, UICtrl, StorageCtrl){

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
    // clear all item 
    document.querySelector(UIselector.btnClear).addEventListener("click", clearAllItem)
  
  }

  const itemAddSubmit = function(e) {
    e.preventDefault();
    const input = UICtrl.getItemInput();

    
    if(input.name !== '' && input.calories !== '' && !isNaN(+(input.calories))) {
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      
      StorageCtrl.setItemsStorage(newItem);
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
    //update itemList
    UICtrl.updateItemList(...updateItem);
    // update localStorage items
    StorageCtrl.updateItemsStorage(...updateItem);

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

    StorageCtrl.deleteItemsStorage(idCurrentItem);
    // show total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();
  }

  //clear all item 
  const clearAllItem = function(e) {
    e.preventDefault();

    ItemCtrl.clearListItem();

    UICtrl.clearItems();

    StorageCtrl.clearStorage();

    const totalCalories = ItemCtrl.getTotalCalories();
    // show total calories
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    UICtrl.hideList();
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
})(ItemCtrl, UICtrl, StorageCtrl);


// init app
App.init()


