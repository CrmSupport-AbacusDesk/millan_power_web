import { Component, OnInit } from '@angular/core';import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { DatabaseService } from 'src/app/_services/DatabaseService';
import { SessionStorage } from 'src/app/_services/SessionService';
import { ProductImageModuleComponent } from '../product-image-module/product-image-module.component';


@Component({
  selector: 'app-subcategory-list',
  templateUrl: './subcategory-list.component.html'
})
export class SubcategoryListComponent implements OnInit {

 // toggle = false;
 savingData = false;
 category: any = {};
 loading_list = false;
 total_categories:any = 0;
 sub_categories:any =[];
 last_page: number ;
 current_page = 1;
 search: any = '';
 source: any = '';
 searchData = true;
 isInvoiceDataExist = false;
 filter:any = {};
 filtering : any = false;
 toggle:any;
 toggle1:any;
 selected_image :any = [];
 img_url:string;
 category_id:number
 category_name:any

 uploadUrl:any='';
 
 
 constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router, public ses: SessionStorage,public dialog: DialogComponent, public alrt:MatDialog) {}
 
 ngOnInit() {

    this.uploadUrl = this.db.uploadUrl;
   this.route.params.subscribe(params => {
     console.log(params);
     this.category_id  =  params['id'];
     this.category_name  =  params['category_name'];
     console.log(this.category_name);
     console.log(this.category_id );
     
     
   });
   // this.getSubCategoryList();
   this.getSubCategoryList();
   this.category.image = [];
   this.img_url = this.db.myurl + this.db.img_url + this.db.catalog_img_url 
   
 }
 
 
 
 getData:any = {};
 getSubCategoryList() {
   this.loading_list = true;
   if( this.filter.date || this.filter.location_id )this.filtering = true;
   this.db.post_rqst({ 'filter': this.filter, "id":this.category_id }, 'master/subCategoryForProduct' )
   .subscribe(d => {
     console.log(d);
     
     this.loading_list = false; 
     this.sub_categories = d.sub_category;
     console.log(d.sub_category);
     
     console.log(this.sub_categories);
     
     console.log( this.sub_categories.image );
     
   });
 }


 editCategory(sub_category)
 {
   console.log(sub_category);
   console.log(this.sub_categories);
    //  this.category = this.products.filter( x => x.id==id)[0];
     this.category = this.sub_categories.filter( x => x.sub_category == sub_category)[0];    
     this.category.image = this.category.actual_image_name;
     console.log(this.category);
 }

 
 savesubcategory(form:any)
 {
     this.savingData = true;
     // if(this.category.id){
     //     this.category.edit_cat_id = this.category.id;
     // }
     this.category.created_by = this.db.datauser.id;
     this.category.category_id = this.category_id;
     console.log(this.category);

     this.db.insert_rqst( { 'category' : this.category ,'created_by':this.db.datauser.id,}, 'master/addSubcategory')
     .subscribe( (d) => {
         this.savingData = false;
         if(d['status'] == 'EXIST' ){
             this.dialog.error( 'This Sub Category Already exists');
             return;
         }
         this.toggle = "false";
         this.selected_image=[];
         this.router.navigate(['productsubcatgory/'+this.category_id + '/' + this.category_name]);
         this.dialog.success( 'Sub Category successfully save');
         this.getSubCategoryList();
     });
 }
 
 
 redirect_previous() {
     this.current_page--;
     this.getSubCategoryList();
 
 }
 
 redirect_next() {
     if (this.current_page < this.last_page) { this.current_page++; }
     else { this.current_page = 1; }
     this.getSubCategoryList();
 
 }
 

 

 
 addCategory()
 {
     this.category={};
     //console.log("dscds");
 
 }
 
 catdata:any='';
 
 
 
 img=false;
 onUploadChange1(evt: any) {
     console.log(evt);
     const file = evt.target.files[0];
     this.img=true;
     if (file) {
         const reader = new FileReader();
         reader.onload = this.handleReaderLoaded1.bind(this);
         reader.readAsBinaryString(file);
         console.log(reader);
         console.log('in if')
     }
 
 }
 onUploadChange(evt: any) {
     console.log(evt);
     const file = evt.target.files[0];
     this.img=true;

     if (file) {
         const reader = new FileReader();
         reader.onload = this.handleReaderLoaded1.bind(this);
         reader.readAsBinaryString(file);
         console.log(reader);
         console.log('in if')
     }
 }
 handleReaderLoaded1(e) {
     this.category.image = 'data:image/png;base64,' + btoa(e.target.result) ;
     console.log(this.category.image)
     console.log(this.selected_image)
 }
 
 deleteProduct(sub_category) {
   console.log(sub_category);
   
     this.dialog.delete('Category').then((result) => {
         if(result) {
             this.db.post_rqst({main_category : sub_category}, 'master/addMainCategoryImageDelete')
             .subscribe(d => {
                 console.log(d);
                 this.dialog.successfully();
                 this.getSubCategoryList();
             });
         }
     });
 } 
 
 deleteProductImage(index)
 {
     this.category.image.splice(index,1)
 }
 
 
 active:any='';
 ProductProfile(index)
 {
     this.active=index;
     this.category.profile_selected=index;
 }
 openDialog(id ,string ) {
 
     const dialogRef = this.alrt.open(ProductImageModuleComponent,{
         width: '1024px',
         data: {
             'id' : id,
             'mode' : string,
         }
     });
 
     dialogRef.afterClosed().subscribe(result => {
     });
 
 }
 
 exportMainCategory()
 {
     this.filter.mode = 1;
     this.db.post_rqst(  {'filter': this.filter , 'login':this.db.datauser}, 'master/exportMainCategory')
     .subscribe( d => {
         document.location.href = this.db.myurl+'/app/uploads/exports/MainCategory.csv';
     });
 }
 
 

 
 
 addSubCategory(main_category)
 {
     this.category={};
     this.category.main_category = main_category;
 
 }
 
 editSubCategory(id,index)
 {
     console.log(this.sub_categories   ,id );
     this.category = this.sub_categories.filter( x => x.id==id)[0];
     this.category.profile_selected = 0;
 
     this.selected_image = [];
     for(let i=0;i<this.category.image.length;i++)
     {
 
         if( parseInt( this.category.image[i].profile ) == 1  )
         {
 
             this.category.profile_selected = i;
         }
         this.selected_image.push(this.category.image[i].image);
     }
 
 
 }
 
 
 
 // deleteSubCategory(id) {
 //     this.dialog.delete('Sub Category').then((result) => {
 //         if(result) {
 //             this.db.post_rqst({category_id : id}, 'master/categoryDelete')
 //             .subscribe(d => {
 //                 console.log(d);
 //                 this.getCategoryList();
 //                 this.dialog.successfully();
 //             });
 //         }
 //     });
 // } 
 
 clearData()
 {
     this.selected_image=[];
 }
 
 deleteSubCategoryImage(index)
 {
     this.selected_image.splice(index,1)
 }  
 
}
