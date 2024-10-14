import { Controller, Get, Render, Post, Res, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { DataFormDto } from './dataFormDto.sto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }

  @Get('dataForm')
  @Render('dataForm')
  getDataForm(){
    return {
      data: {
        date: new Date().toISOString().slice(0, 16)
      },
      dateNow: new Date().toISOString().slice(0, 16),
      errors: []
    }
  }

  @Post('dataForm')
  postData(@Body() dataFormDto: DataFormDto, @Res() response: Response){
    let errors = []

    if(!dataFormDto.name || !dataFormDto.email || !dataFormDto.date || !dataFormDto.viewers){
      errors.push("Minden mező kitöltése kötelező!");
    }
    if(!/[A-z]@[A-z]./.test(dataFormDto.email)){
      errors.push("Email helyes fomrája: pelda@email.com");
    }
    if(Date.now() > new Date(dataFormDto.date).getTime()){
      errors.push("A jelenlegi dátum előtti kiválasztása nem lehetséges")
    }
    if(parseInt(dataFormDto.viewers) < 1){
      errors.push("Nem lehet 1-nél kevesebb néző számára helyet foglalni")
    }
    if(parseInt(dataFormDto.viewers) > 10){
      errors.push("Nem lehet 10-nél több néző számára helyet foglalni")
    }
    
    if(errors.length > 0){
      response.render('dataForm', {
        data: dataFormDto,
        dateNow: new Date().toISOString().slice(0, 16),
        errors
      });
      return;
    }

    response.redirect('/success')

  }

  @Get('success')
  getSuccess(){
    return "Sikeres foglalás"
  }

}
