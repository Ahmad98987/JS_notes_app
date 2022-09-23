let showBtn = document.querySelector(".add_btn");
let closeBtn = document.querySelector(".close_btn");
let createBtn = document.querySelector(".create_btn");
let createForm = document.querySelector("#add_note_form");

// Show modal 
showBtn.addEventListener("click", () => {
    document.querySelector(".modal-overlay").style.display = "block";
});

// Close Button
closeBtn.addEventListener("click", () => {
    document.querySelector(".modal-overlay").style.display = "none";
    createForm.reset();
});

// Add Note
createBtn.addEventListener("click", (e) => {

    e.preventDefault();

    let key = document.querySelector("#id").value;
    let uni_id = 0;
    let title = document.querySelector("#title").value;
    let desc = document.querySelector("#description").value;

    if(key == "")
    {
        uni_id = Math.random().toString(16).slice(2);
    }
    else
    {
        uni_id = key;
    }

    if(title == "")
    {
        // error
        error("Please enter note title !!");
    }
    else
    {
        if(desc == "")
        {
            // error
            error("Please enter note description !!");
        }
        else
        {
            let DB = localStorage.getItem("notes");
            if(DB == null)
            {
                // Record not found
                let data = [];
                let record = { id:uni_id, title:title, desc:desc };
                data.push(record);
                localStorage.setItem("notes", JSON.stringify(data));
                success("Note added successfully !!");
            }
            else
            {
                let exist_record = JSON.parse(DB);
                let old_record = exist_record.find((item) => item.id == uni_id);
                if(old_record)
                {
                    // Update record
                    exist_record.map((get) => {
                        if(get.id == old_record.id)
                        {
                            get.title = title;
                            get.desc = desc;
                        }
                    });
                    localStorage.setItem("notes", JSON.stringify(exist_record));
                    success("Record updated successfully !!");
                    form.reset();
                }
                else
                {
                    // Add Record
                    let record = { id:uni_id, title:title, desc:desc };
                    exist_record.push(record);
                    localStorage.setItem("notes", JSON.stringify(exist_record));
                    success("Note added successfully !!");
                }
            }
        }
    }
    fetchAll();

});


// Show All Notes
function fetchAll()
{
    let record = JSON.parse(localStorage.getItem("notes"));
    if(record == null)
    {
        console.log("no record fount yet");
    }
    else
    {
        html = "";
        record.map((list) => { 
            html += `
            <div class="note_wrap">
                <div class="NW_top">
                    ${list.title}
                    <span onclick="edit('${list.id}')"><i class="fa fa-edit"></i></span>
                    <span onclick="remove('${list.id}')"><i class="fa fa-trash"></i></span>
                </div>
                <div class="NW_bottom">
                    ${list.desc}
                </div>
            </div>
            `;
        });
        document.querySelector(".note_container").innerHTML = html;
    }
}
fetchAll();



// Edit note
let edit = (id) => {
    let key = document.querySelector("#id");
    document.querySelector(".modal-overlay").style.display = "block";
    let record = JSON.parse(localStorage.getItem("notes"));
    record.map((get) => {
        if(get.id == id)
        {
            key.value = get.id;
            document.querySelector("#title").value = get.title;
            document.querySelector("#description").value = get.desc;
        }
    });
}

let remove = (id) => {

    let conf = confirm("Do you really want to remove this note?");
    if(conf)
    {
        let record = JSON.parse(localStorage.getItem("notes"));
        let newRecord = record.filter((list) => list.id != id);
        localStorage.setItem("notes", JSON.stringify(newRecord));
        fetchAll();
    }

}


// Error Message
let error = (msg) => {

    let error = document.querySelector("#error");
    error.innerText = msg;
    error.style.display = "block";
    setTimeout(() => {
        error.style.display = "none";
    }, 4 * 1000);
}

// Success Message 
let success = (msg) => {

    let success = document.querySelector("#success");
    success.innerText = msg;
    success.style.display = "block";
    createForm.reset();
    setTimeout(() => {
        success.style.display = "none";
    }, 4 * 1000);
    setTimeout(() => {
        document.querySelector(".modal-overlay").style.display = "none";
    }, 5 * 1000);

}