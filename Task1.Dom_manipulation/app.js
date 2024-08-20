window.addEventListener('load', solve);

function solve() {

        
        let carModel = document.getElementById("car-model");
        let carYear = document.getElementById("car-year");
        let partName = document.getElementById("part-name");
        let partNumber = document.getElementById("part-number");
        let condition = document.getElementById("condition");
        let nextBtnElement = document.getElementById("next-btn");
        let infoListElement = document.querySelector(".info-list");
        let confirmListlement = document.querySelector(".confirm-list");
        let completeP = document.getElementById("complete-text");
        let completeImg = document.getElementById("complete-img");

        nextBtnElement.addEventListener("click", onNext);

        function onNext(e) {
                completeImg.style.visibility = "hidden";
                completeP.textContent = "";
                e.preventDefault();
                if (
                        carModel.value == "" ||
                        carYear.value == "" ||
                        partName.value == "" ||
                        partNumber.value == "" ||
                        condition.value == ""
                ) {
                        alert("All fields must be filled!");
                        return;
                }
                let year = parseInt(carYear.value);

                if(year > 2023 || year < 1980) {
                        alert("Year must be between 1980 and 2023!");
                        return;                        
                }


                let articleInfo = document.createElement("article");
                let liElementInfo = document.createElement("li");
                liElementInfo.setAttribute("class", "part-content");

                let carModelInfo = document.createElement("p");
                carModelInfo.textContent = `Car Model: ${carModel.value}`;

                let carYearInfo = document.createElement("p");
                carYearInfo.textContent = `Car Year: ${carYear.value}`;

                let partNameInfo = document.createElement("p");
                partNameInfo.textContent = `Part Name: ${partName.value}`;

                let partNumberInfo = document.createElement("p");
                partNumberInfo.textContent = `Part Number: ${partNumber.value}`;

                let conditionInfo = document.createElement("p");
                conditionInfo.textContent = `Condition: ${condition.value}`;
                
                let btnContainer = document.createElement("div");
                btnContainer.setAttribute("class", "btn-container");

                let editBtn = document.createElement("button");
                editBtn.setAttribute("class", "edit-btn");
                editBtn.textContent = "Edit";

                let continueBtn = document.createElement("button");
                continueBtn.setAttribute("class", "continue-btn");
                continueBtn.textContent = "Continue";

                articleInfo.appendChild(carModelInfo);
                articleInfo.appendChild(carYearInfo);
                articleInfo.appendChild(partNameInfo);
                articleInfo.appendChild(partNumberInfo);
                articleInfo.appendChild(conditionInfo);

                btnContainer.appendChild(editBtn);
                btnContainer.appendChild(continueBtn);

                liElementInfo.appendChild(articleInfo);
                liElementInfo.appendChild(btnContainer);

                infoListElement.appendChild(liElementInfo);

                let editedCarModel = carModel.value;
                let editedYear = carYear.value;
                let editedPartName = partName.value;
                let editedPartNumber = partNumber.value;
                let editedCondition = condition.value;

                carModel.value = "";
                carYear.value = "";
                partName.value = "";
                partNumber.value = "";
                condition.value = "";

                nextBtnElement.disabled = true;

                editBtn.addEventListener("click", onEdit);

                function onEdit() {
                        carModel.value = editedCarModel;
                        carYear.value = editedYear;
                        partName.value = editedPartName;
                        partNumber.value = editedPartNumber;
                        condition.value = editedCondition;

                        liElementInfo.remove();
                        nextBtnElement.disabled = false;
                }

                continueBtn.addEventListener("click", onContinue);

                function onContinue() {
                        let liElementConfirm = document.createElement("li");
                        liElementConfirm.setAttribute("class", "part-content");

                        let articleElementConfirm = document.createElement("article");
                        articleElementConfirm = articleInfo; 

                        let confirmBtn = document.createElement("button");
                        confirmBtn.setAttribute("class", "confirm-btn");
                        confirmBtn.textContent = "Confirm";
                        let cancelBtn = document.createElement("button");
                        cancelBtn.setAttribute("class", "cancel-btn");
                        cancelBtn.textContent = "Cancel";
                        
                        liElementConfirm.appendChild(articleElementConfirm);
                        liElementConfirm.appendChild(confirmBtn);
                        liElementConfirm.appendChild(cancelBtn);

                        liElementInfo.remove();

                        confirmListlement.appendChild(liElementConfirm);

                        confirmBtn.addEventListener("click", onConfirm);
                        function onConfirm() {
                                liElementConfirm.remove();
                                nextBtnElement.disabled = false;
                                completeP.textContent = `Part is Ordered!`;
                                completeImg.style.visibility = "visible";
                        }

                        cancelBtn.addEventListener("click", onCancel);
                        function onCancel() {
                                liElementConfirm.remove();
                                nextBtnElement.disabled = false;
                        }
                }
        }
}
