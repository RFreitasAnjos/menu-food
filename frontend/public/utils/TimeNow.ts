export default function TimeNow(): boolean{
   const now = new Date();
   const hours = now.getHours();
   
   return hours >= 17;
}