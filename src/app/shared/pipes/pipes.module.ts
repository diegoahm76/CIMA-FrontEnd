import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FechaHoraPipe, JoinPipe, PluckPipe, ReplacePipe, UCFirstPipe} from '.';

@NgModule({
  imports: [CommonModule],
  declarations: [FechaHoraPipe, JoinPipe, PluckPipe, ReplacePipe, UCFirstPipe],
  exports: [FechaHoraPipe, JoinPipe, PluckPipe, ReplacePipe, UCFirstPipe],
  providers: [],
})
export class PipesModule {}
