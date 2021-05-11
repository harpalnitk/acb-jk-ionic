import { ToolbarContentComponent } from './header/toolbar-content/toolbar-content.component';
import { HeaderComponent } from './header/header.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [HeaderComponent, ToolbarContentComponent],
  imports: [CommonModule, IonicModule],
  exports: [HeaderComponent],
})
export class CorePageModule {}
