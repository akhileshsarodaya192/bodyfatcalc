import { LightningElement } from 'lwc';
import BODY_FAT_PER__C  from '@salesforce/schema/Body_Fat_Percentage__c';
import First_Name  from '@salesforce/schema/Body_Fat_Percentage__c.First_Name__c';
import Last_Name  from '@salesforce/schema/Body_Fat_Percentage__c.Last_Name__c';
import Email_Id from '@salesforce/schema/Body_Fat_Percentage__c.Email__c';
import User_Body_Fat  from '@salesforce/schema/Body_Fat_Percentage__c.User_Body_Fat_Percentage__c';

export default class BodyFatCalculator extends LightningElement {
    //Input Variables
    neck;
    waist;
    height;
    hip;
    isFemale = false;
    bodyFatResult = ' ';
    showResult = false;
    isMale = true;
    showFitnessInfo = false;
    showUserForm = false;

    userCalBodyPer;

    objectApiName = BODY_FAT_PER__C;
    userBodyPer = User_Body_Fat;
    firstName = First_Name;
    lastName = Last_Name;
    email = Email_Id;
    recordId;

    //method to show fitness info to user after clicking column 1
    handleInfo()
    {
        this.showFitnessInfo = true;
    }

    handleBack()
    {
        this.showFitnessInfo = false;
    }


   /* handleFemaleInfo()
    {
        this.takeWomenInfo = true;
    }
    handleMaleInfo()
    {
        this.takeWomenInfo = false;
    }*/

    //method to handle input changes and assign values to respective variables
    inputHandler(event)
    {
        const {name,value} = event.target;

        if(name === "neck"){
            this.neck = value;
            console.log("neck: ",this.neck);
        }
        if(name === "waist"){
            this.waist = value;
            console.log("waist: ",this.waist);
        }
        if(name === "height"){
            this.height = value;
            console.log("height: ",this.height);
        }
        if(name === "hip"){
            this.hip = value;
            console.log("hip: ",this.hip);
        }
    }
//method to handle gender selection
    handleGenderInput(event)
        {
        const selectedValue = event.target.value;
        if (selectedValue === 'male'){
            this.isMale = true;
            this.isFemale = false;
        }
        else if (selectedValue === 'female'){
            this.isMale = false;
            this.isFemale = true;
        }
        console.log("gender: ", selectedValue);
    }


    //method to calculate body fat percentage
    handleCalculate(event){
        this.showResult = true;
        this.calculateBodyFat();
        event.preventDefault();
    }

    calculateBodyFat()
    {
        if(this.neck && this.waist && this.height){
            const neckValue = parseFloat(this.neck);
            const waistValue = parseFloat(this.waist);
            const heightValue = parseFloat(this.height);
            
            let bodyFat = 0;

            if(this.isFemale)
            {
                const hipValue = parseFloat(this.hip);
                bodyFat = 163.205 * Math.log10(waistValue + hipValue - neckValue) - 97.684 * Math.log10(heightValue) - 78.387;
            }
            else
            {
                bodyFat = 86.01 * Math.log10(waistValue - neckValue) - 70.041 * Math.log10(heightValue) + 36.76;
            }

            if(bodyFat > 0)
            {
                this.bodyFatResult = bodyFat.toFixed(2) + '%';
            }
            else
            {
                this.bodyFatResult = 'Entered Inputs are Invalid. Re-enter the correct values';
            }
            this.userCalBodyPer = this.bodyFatResult;//userCalBodyPer is the issue
        }

    }

    handleRecompute(){
    this.showResult = false;
    this.showFitnessInfo = false;
    this.neck ='';
    this.waist ='';
    this.height ='';
    this.hip ='';
    
    this.isMale = true;
    this.isFemale = false;
    this.bodyFatResult ='';
    this.showUserForm = false;
    }

    handleGetEmail()
    {
        this.showUserForm = true;
    }

    handleSubmit()
    {
        console.log('Send Email Request Submitted');
    }

    handleUserFormSuccess()
    {
        this.handleRecompute();
        console.log('Email Sent Successfully');
    }

    handleUserFormBackEvent()
    {
        this.showUserForm = false;
        this.handleRecompute();
    }
    //above is the back button of LDS.
}
