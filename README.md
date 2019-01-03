# Tawjihi Backend Server
The RESTful API to be utilized by the Android Tawjihi Application.

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
about give user.
Such info includes its overall Rank in that year.

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
    **Content:** `{ "overAllRank" : "999",
                    "branchRank" : "999",
                    "schoolRank" : "999",
                    "Branch" : "999",
                    "regionRank" : "999"
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
