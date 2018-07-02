import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ToolbarSettingsPage } from './toolbar-settings';

@NgModule({
  declarations: [
    ToolbarSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(ToolbarSettingsPage),
  ],
  exports: [
    ToolbarSettingsPage
  ]
})
export class ToolbarSettingsModule {}
