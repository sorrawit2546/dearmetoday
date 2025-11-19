import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../components/header/header';
import { Api } from '../services/api';
import { garden, seed, stackRecord } from '../model/seed-stack';


@Component({
  selector: 'app-seed-stack',
  imports: [Header, CommonModule],
  templateUrl: './seed-stack.html',
  styleUrl: './seed-stack.css'
})


export class SeedStack implements OnInit, OnDestroy{
  private apiServices = inject(Api);

  //**************************************** Signals ************************************************************************** */
  stackRecord = signal<stackRecord>({
    id: '',
    userID: '',
    seedID: '',
    stack: 0,
    status: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  seed = signal<seed>({
    id: '',
    nameEng: '',
    nameTH: '',
    description: '',
    growthDays: 0,
    icon: '',
    renderType: '',
    imageStage: [],
    animationfile: '',
    animationKey: '',
    rarity: '',
    emotionTag: '',
  })
  garden = signal<garden>({
    id: '',
    userID: '',
    seedID: '',
    amount: 0,
    icon: '',
  })
  plant = signal<string>('');
  dialyMessage = signal<string>('');
  plantedAmount = signal<Number>(0);
  speciesAmount = signal<Number>(0);

  //**************************************** Call services ************************************************************************** */
  // getStack()
  // This function is used to call service that fetch data in stackRecord table
  getStack(): void {
    this.apiServices.getStackRecordByID().subscribe({
      next: (record:stackRecord) => {
        if (record?.id) {
          this.stackRecord.set(record)
          this.getSeed(() => {
            this.calPlantState()
          })
          //this.calPlantState()
        } else {
          this.plant.set('assets/images/testFlower.png') // mockup img
        }
      },
      error: () => {
        this.plant.set('assets/images/testFlower.png')
      }
    })
  }
  // getSeed()
  // This function is used to call service that fetch data in Seed table
  getSeed(done?:() => void): void {
    this.apiServices.getSeedByID().subscribe({
      next: (respone: seed) => {
        this.seed.set(respone);
        done?.();
      },
      error: () => {

      }
    })
  }
  // getGarden()
  // This function is used to fetch data in Garden table
  getGarden(): void {
    this.apiServices.getGardenByID().subscribe({
      next: (respone: garden) =>{
        this.garden.set(respone);
      },
      error: () => {

      }
    })
  }

  //**************************************** Others ************************************************************************** */
  // displayDialyMessage()
  // This function is used to set dialy message depend on stackRecord.updateAt,Set result as --> this.dialyMessage
  displayDialyMessage(): void {
    const dailyMessageList = [
      'สวนนี้ยังว่างเปล่า มาเริ่มต้นปลูกดอกไม้และเขียนบันทึกกันเถอะ',
      'อย่าปล่อยให้ดอกไม้เหี่ยวเฉา เขียนบันทึกและรดน้ำต้นไม้กันนะ',
      'วันนี้คุณเขียนบันทึกแล้ว กลับมารดน้ำใหม่พรุ่งนี้นะ',
    ]
    if (!this.stackRecord().id) {
      this.dialyMessage.set(String(dailyMessageList.at(0))); 
    } else {
      if (this.calLastUpdate(this.stackRecord().updatedAt, 1)){
        this.dialyMessage.set(String(dailyMessageList.at(1)));
      } else {
        this.dialyMessage.set(String(dailyMessageList.at(2)));
      }
    }
  }

  //**************************************** Utilities ************************************************************************** */
  // calPlantState()
  // This function is used to calculate state of growths,then set state to --> this.plant
  calPlantState(): void {
    const percentProgress = 100;
    const immageStages = this.seed().imageStage;
    const dayUntillBloom = Number(this.seed().growthDays);
    const currentStack = Number(this.stackRecord().stack);
    if (immageStages) {
      const percentOfState = percentProgress / immageStages.length //Calculate percent of state in each plant
      const currentProgress = (currentStack * 100) / dayUntillBloom //Calculate current progress
      let stateIndex = Math.floor(currentProgress / percentOfState) //Find current state
      stateIndex = Math.max(0, Math.min(stateIndex, immageStages.length - 1)) //Scope range
      this.plant.set( String(immageStages.at(stateIndex)));
    }
  }
  // calLastUpdate() 
  // This function is used to calculate last update up to scope and return --> boolean
  calLastUpdate(targetDate: Date, rangeDate: Number): boolean {
    const rangeMS = Number(rangeDate) * 60 * 60 * 1000;
    const currentTime = Date.now();
    const targetMS = new Date(targetDate).getTime();
    const timeDifference = currentTime - targetMS;
    return(timeDifference > rangeMS)
  }
  // calPlantedAmount()
  // This function is used to calculate flower that has been planted 
  // calPlantedAmount(collection: []): void {
  //   for(const planted of collection){
    
  //   }
  // }
  // calSpeciesAmount()
  // This function is used to calculate species amount that user has been planted
  calSpeciesAmount(collection: []): void{
    this.speciesAmount.set(Number(collection.length));
  }
  
  
  //Mock up data
  flowers = [
    { id: 1, imageUrl: 'https://picsum.photos/200?random=1', species: 'blue' },
    { id: 2, imageUrl: 'https://picsum.photos/200?random=2', species: 'blue' },
    { id: 3, imageUrl: 'https://picsum.photos/200?random=3', species: 'pink' },
    { id: 4, imageUrl: 'https://picsum.photos/200?random=4', species: 'pink' },
    { id: 5, imageUrl: 'https://picsum.photos/200?random=5', species: 'yellow' },
    { id: 6, imageUrl: 'https://picsum.photos/200?random=6', species: 'yellow' },
    { id: 7, imageUrl: 'https://picsum.photos/200?random=7', species: 'yellow' },
    { id: 8, imageUrl: 'https://picsum.photos/200?random=8', species: 'yellow' },
    { id: 9, imageUrl: 'https://picsum.photos/200?random=9', species: 'yellow' }
  ];

  // นับจำนวนสายพันธุ์แบบ unique
  speciesCount = new Set(this.flowers.map(f => f.species)).size;

  //**************************************** Angular State ************************************************************************** */
  ngOnInit(): void {
    this.getStack();
    this.displayDialyMessage();
  }
  ngOnDestroy(): void {
    
  }
}
