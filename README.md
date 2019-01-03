# Tawjihi Backend Server
The RESTful API to be utilized by my [Tawjihi Application](https://github.com/ghaith96/Tawjihi-Android-App) project.

---
**Search**
----
  Queries the database.
  Returns Array of JSON objects that matches the provided parameters.

* **URL**

  /search

* **Method:**

  `POST`
  
* **Data Params (atleast one is required)**

   `Name=[string]`
   
   `Branch=[string]`
   
   `School=[string]`
   
   `Region=[string]`
   
   `Year=[integer]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `[{ "Name" : "محمد احمد محمود",
                    "Year" : "2015",
                    "Region" : "نابلس",
                    "Branch" : "العلمي",
                    "School" : "الصلاحية الثانوية للبنين",
                    "Score" : 90.5 
                    }]`
 
* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/search",
      dataType: "json",
      type : "POST",
      data: {Name: "محمد احمد محمود", Branch: "العلمي"}
      success : function(r) {
        console.log(r);
      }
    });
  ```
  
---
**Calculate Stats**
----

Calculate different statistical information
about a given user.
Such info includes its overall rank in that year
and its rank among students from the same school.

* **URL**

  /stats

* **Method:**

  `POST`
  
* **Data Params**

   **Required:**
   
   `Name=[string]`
   
   `Branch=[string]`
   
   `School=[string]`
   
   `Region=[string]`
   
   `Year=[integer]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ "overAllRank" : "99999",
                    "branchRank" : "999",
                    "schoolRank" : "9",
                    "Branch" : "9999",
                    "regionRank" : "99"
                    }`
 
* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/search",
      dataType: "json",
      type : "POST",
      data: { "Name" : "محمد احمد محمود", "Year" : "2015", "Region" : "نابلس", "Branch" : "العلمي", "School" : "الصلاحية الثانوية للبنين", "Score" : 90.5 }
      success : function(r) {
        console.log(r);
      }
    });
  ```
  
  ### TODO:
  * Modulate the source code.
  * Optimize getHints route.
  * Implement Error responses.
  * Implement simple authentication.
