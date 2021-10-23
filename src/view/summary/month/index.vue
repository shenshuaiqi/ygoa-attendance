<template>
  <Card :bordered="false" dis-hover>
    <FullCalendar style="width: 80%;margin: 0 auto" defaultView="dayGridMonth" :height="650" :locales="locales" :locale="locale" :plugins="calendarPlugins" />
  </Card>
</template>

<script>
  import FullCalendar from '@fullcalendar/vue'
  import dayGridPlugin from '@fullcalendar/daygrid'

  import zhLocale from '@fullcalendar/core/locales/zh-cn';

  export default {
    name: "index",
    data() {
      return {
        calendarPlugins: [ dayGridPlugin ],
        locales: zhLocale,
        locale: 'zh-cn'
      }
    },
    components:{
      FullCalendar
    }
  }
</script>

<style scoped lang="less">
  @import '~@fullcalendar/core/main.css';
  @import '~@fullcalendar/daygrid/main.css';
  .fc-row{
    height: 100px;
  }
</style>
