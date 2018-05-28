import {Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {NgModel, ControlValueAccessor} from "@angular/forms";
import { TranslateService } from '../../translate/translate.service';
import "./pagination.component.less";

@Component({
	selector: 'ng-pagination[ngModel]',
	template: require('./pagination.component.html')
})
export class PaginationComponent implements ControlValueAccessor, OnInit, OnChanges{
	@Input("totalCount") totalCount:number;
	@Input("currentPageIndex") currentPageIndex:number;
	@Input("pageSize") pageSize:number = 16;
  @Output("onPageIndexChanged") onPageIndexChanged = new EventEmitter();
  pageList:Array<number> = [];
  private pageCount: number;
  private startCount: number;
  private endCount: number;
  private goCurrentPage: number;
  private onChange: Function;
  private onTouched: Function;
	private seletedPage: number;
  private nextItem: number;
  private preItem: number;
  private nextItemValid: boolean;
  private previousItemValid: boolean;
  ngOnChanges(changes){
    this.ngOnInit();
  }
	constructor(private onPageIndexChangedNgModel: NgModel) {
    this.onPageIndexChangedNgModel.valueAccessor = this;
  }
  ngOnInit() {
    this.doPaging();
  }
  doPaging() {
    this.pageList = [];
    var i,count;
    this.seletedPage = this.currentPageIndex;
    this.pageCount = Math.ceil(this.totalCount / this.pageSize);
		this.startCount = (this.currentPageIndex - 1) * this.pageSize + 1;
		this.endCount = (Math.min((this.currentPageIndex * this.pageSize), this.totalCount));
    if (this.pageCount > 6) {
      for (i = (this.currentPageIndex), count=0; i<= this.pageCount && count<6; i++, count++) {
        this.pageList.push(i);
      }
    } else {
      for (i = 1, count=0; i<= this.pageCount && count<6; i++, count++) {
        this.pageList.push(i);
      }
    }
    //next validation
    if(this.currentPageIndex<this.pageCount) {
      this.nextItemValid = true;
      this.nextItem = Number(this.currentPageIndex) + 1;
    }else {
      this.nextItemValid = false;
    }
    //previous validation
    if((this.currentPageIndex) >1) {
      this.previousItemValid = true;
      this.preItem = this.currentPageIndex -1;
    }else {
      this.previousItemValid = false;
    }
  }
  setCurrentPage(pageNo) {
    this.currentPageIndex = pageNo;
    this.onPageIndexChangedNgModel.viewToModelUpdate(pageNo);
    this.onPageIndexChageListner();
    this.doPaging();
  }
  goPage(pageNo) {
    if (pageNo === undefined || pageNo === null) {
      return;
    }
    if(parseInt(pageNo) < 1 || parseInt(pageNo) > this.pageCount) {
      this.goCurrentPage = null;
      return;
    }
    this.currentPageIndex = pageNo;
    this.onPageIndexChangedNgModel.viewToModelUpdate(pageNo);
    this.onPageIndexChageListner();
    this.doPaging();
    this.goCurrentPage = null;
  }
  nextPage(pageNo) {
    if (this.goCurrentPage || this.goCurrentPage === undefined) {
      if (this.currentPageIndex + 1 > this.pageCount) {
        return
      } else {
        this.currentPageIndex = this.currentPageIndex + 1;
      }
    } else {
       this.currentPageIndex = pageNo;
    }
    this.onPageIndexChangedNgModel.viewToModelUpdate(pageNo);
    this.onPageIndexChageListner();
    this.doPaging()
  }
  previousPage(pageNo) {
    if (this.goCurrentPage) {
      if (this.currentPageIndex -1 < 1) {
        return
      } else {
        this.currentPageIndex = this.currentPageIndex - 1;
        this.onPageIndexChangedNgModel.viewToModelUpdate(this.currentPageIndex);
        this.onPageIndexChageListner();
        this.doPaging();
      }
    } else {
      if (this.currentPageIndex === 1) {
        return;
      }
      var temp = pageNo;
      this.currentPageIndex = temp > 0 ?temp: 1;
      this.onPageIndexChangedNgModel.viewToModelUpdate(this.currentPageIndex);
      this.onPageIndexChageListner();
      this.doPaging();
    }
  }
  writeValue(value: string): void {
    if (!value) return;
    this.setValue(value);
  }
  registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (_: any) => {}): void {
    this.onTouched = fn;
  }
  setValue(currentValue){
    this.currentPageIndex = currentValue;
  }
  onPageIndexChageListner() {
    this.onPageIndexChanged.emit({
      currentPageIndex: this.currentPageIndex - 1,
      pageSize: this.pageSize
    })
  }
}
