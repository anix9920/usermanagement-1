{
    function openNav(){
         var isChecked = $("#btnControl").prop("checked");
         if (isChecked){
             document.getElementById("sidebar").style.width = "0";
             document.getElementById("main").style.marginLeft = "0";
         } else{
             document.getElementById("sidebar").style.width = "8rem";
          document.getElementById("main").style.marginLeft = "8rem";
        }
    }
  function selectAll(el) {
    var isChecked = $(el).prop("checked");
    //   var selector = $(el).data("target");
    $(".roleCheck").prop("checked", isChecked);
  }
  // do Filter on View
  $("#userSearch").on("keyup", function () {
    var inputValue = $(this).val().toLowerCase();
    $("#userTable tbody tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(inputValue) > -1);
    });
  });

  //select all check box
  //   $("#selectall").on("click", function () {
  //     var isChecked = $(this).prop("checked");
  //     var selector = $(this).data("target");
  //     $(selector).prop("checked", isChecked);
  //   });

  $("#addUser").click(function () {
    const roles = [];
    var userObj = {};
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var userName = document.getElementById("userName").value;
    var description = document.getElementById("description").value;
    var checkBoxes = document.getElementsByName("role-checkbox");
    for (var i = 0; i < checkBoxes.length; i++) {
      if (checkBoxes[i].checked) {
        roles.push(checkBoxes[i].attributes.value.nodeValue);
      }
    }
    if (firstName != "" && lastName != "" && userName != "" && roles!=[]){
      userObj.firstName = firstName.trim();
    userObj.lastName = lastName.trim();
    userObj.userName = userName.trim();
    userObj.description = description.trim();
    userObj.roles = roles;
    //    console.log(userObj)

    // $.post("/addUser",userObj);

    $.ajax({
      type: "POST",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify(userObj),
      url: "/addUser",
    })
      .done(function (response) {
        console.log("Response of update: ", response);
        if (response.includes("user alredy exist...")) {
          alert(response);
        } else {
              console.log(response);
          window.location.href = "http://localhost:3000";
        }
      })
      .fail(function (xhr, textStatus, errorThrown) {
        console.log("ERROR: ", xhr.responseText);
        return xhr.responseText;
      });
    }else{
        alert("some fileds are empty...");
    }
  });

   $("#editUser").click(function () {
     const roles = [];
     var userObj = {};
     var firstName = document.getElementById("firstName").value;
     var lastName = document.getElementById("lastName").value;
     var userName = document.getElementById("userName").value;
     var description = document.getElementById("description").value;
     var checkBoxes = document.getElementsByName("role-checkbox");
     for (var i = 0; i < checkBoxes.length; i++) {
       if (checkBoxes[i].checked) {
         roles.push(checkBoxes[i].attributes.value.nodeValue);
       }
     }
     if (firstName != "" && lastName != "" && userName != "" && roles != []) {
       userObj.firstName = firstName.trim();
       userObj.lastName = lastName.trim();
       userObj.userName = userName.trim();
       userObj.description = description.trim();
       userObj.roles = roles;
       //    console.log(userObj)

       // $.post("/addUser",userObj);

       $.ajax({
         type: "POST",
         dataType: "json",
         contentType: "application/json",
         data: JSON.stringify(userObj),
         url: "/editUser",
       })
         .done(function (response) {
           console.log("Response of update: ", response);
           if (response.includes("user alredy exist...")) {
             alert(response);
           } else {
               console.log(response)
             window.location.href = "http://localhost:3000";
           }
         })
         .fail(function (xhr, textStatus, errorThrown) {
           console.log("ERROR: ", xhr.responseText);
           return xhr.responseText;
         });
     } else {
       alert("some fileds are empty...");
     }
   });
  async function getRoleTableData(root) {
    const resp = await fetch(root.dataset.url);
    const data = await resp.json();
    // console.log(data)
    const table = root.querySelector(".table");
    for (const row of data.roles) {
      table.querySelector("tbody").insertAdjacentHTML(
        "beforeend",
        `
            <tr>
            <td> <input type="checkbox" class="roleCheck" name="role-checkbox" value="${row.name}"></td>
            <td> ${row.name}</td>
            <td> ${row.desc}</td>
            <td> ${row.roles}</td>
            </tr>
            `
      );
    }
  }
  // var tab = document.getElementById("roles-table");
  for (const root of document.querySelectorAll("#roles-table[data-url]")) {
    const table = document.createElement("table");
    table.classList.add("table");
    table.classList.add("table-sm");
    table.innerHTML = `
        <thead class="thead-light">
            <tr>
                <th scope="col"> <div class="input-group">
                    <input type="checkbox" onChange="selectAll(this)"   id="selectall" aria-label="">
                </th>
                <th scope="col">Role Name</th>
                <th scope="col">Description</th>
                <th scope="col">role</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
      `;
    root.append(table);
    getRoleTableData(root);
  }
  for (const root of document.querySelectorAll("#users-table[data-url]")) {
    const table = document.createElement("table");
    table.id = "userTable";
    table.classList.add("table");
    table.classList.add("table-sm");
    table.innerHTML = `
        <thead class="thead-light">
            <tr>
               <th scope="col">User Name</th>
               <th scope="col">Role</th>
               <th scope="col">Action</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
      `;
    root.append(table);
    getUserTableData(root);
  }
  async function getUserTableData(root) {
    const resp = await fetch("/data");
    const data = await resp.json();
    // console.log(data)
    const table = root.querySelector(".table");
    for (const row of data.users) {
      // row.roles =  row.roles.replace("[","").replace("]","")
      table.querySelector("tbody").insertAdjacentHTML(
        "beforeend",
        `
            <tr>
            <td><a href="/editUser?usr=${row.userName}"> ${row.userName}</a></td>
            <td> ${row.roles}</td>
            <td>  <button class='btn btn-s' onClick="delUser('${row.userName}')"><i class="fa fa-trash" aria-hidden="true"></i></button> </td>
            </tr>
            `
      );
    }
  }
  function delUser(userName) {
    var user = { userName: userName };
    $.ajax({
      type: "POST",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify(user),
      url: "/removeUser",
    })
      .done(function (response) {
        console.log("Response of update: ", response);
        alert(response);
        window.location.href = "http://localhost:3000"
      })
      .fail(function (xhr, textStatus, errorThrown) {
        console.log("ERROR: ", xhr.responseText);
        return xhr.responseText;
      });
      
  }
 $("#userName").on("change", editUser());

   async function editUser() {
    const resp = await fetch("/data");
    const data = await resp.json();
    var userName = document.getElementById("userName").value;
    userName = userName.trim();
    var user;
    for (const u of data.users) {
        if(u.userName === userName){
             user = u;
             break;
        }
     
    }
    document.getElementById("firstName").value = user.firstName;
    document.getElementById("lastName").value = user.lastName;
    // document.getElementById("userName").value = user.userName;
    document.getElementById("description").value = user.description;
    var checkBoxes = document.getElementsByName("role-checkbox");
    for (var i = 0; i < checkBoxes.length; i++) {
      if (user.roles.includes(checkBoxes[i].attributes.value.nodeValue)) {
        checkBoxes[i].checked = true;
      }
    }
  }
  // console.log(tab);
}
