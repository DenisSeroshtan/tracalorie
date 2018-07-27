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
    calories: "#item-calories"
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
      li.id = `item=${name.id}`;

      li.innerHTML = `
        <strong>${item.name}: </strong> <em>${item.calories} калорий</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      `;

      //insert item 
      document.querySelector(UISelector.itemList).insertAdjacentElement('beforeend', li)

    },
    clearFields: function() {
      document.querySelector(UISelector.name).value = '';
      document.querySelector(UISelector.calories).value = '';
    },
    hideList: function() {
      document.querySelector(UISelector.itemList).style.display = 'none';
    }
  }
})();

//App controller
const App = (function(ItemCtrl, UICtrl){

  const UIselector = UICtrl.getSelector();
  const loadEventListener = function() {

    document.querySelector(UIselector.form).addEventListener('submit', itemAddSubmit);

  }


  const itemAddSubmit = function(e) {
    e.preventDefault();
    const input = UICtrl.getItemInput();

   
    if(input.name !== '' && input.calories !== '' && !isNaN(+(input.calories))) {
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      UICtrl.addListItem(newItem);

      // clear fields
      UICtrl.clearFields()
    }
  
  }

  return {
    init: function() {
      const items = ItemCtrl.getItems();
      
      loadEventListener()

      if(items.length === 0) {
        UICtrl.hideList()
      } else {
        UICtrl.populateItemList(items)

      }
    }
  }
})(ItemCtrl, UICtrl);
// item controller 

// init app
App.init()


