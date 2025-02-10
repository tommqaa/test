document.addEventListener('DOMContentLoaded', function() {
    let currentDate = new Date();
    let currentView = 'month'; // 添加视图状态跟踪
    let events = JSON.parse(localStorage.getItem('calendarEvents')) || {};

    // 初始化日历
    function initCalendar() {
        updateMonthDisplay();
        renderCalendar();
        attachEventListeners();
    }

    // 更新月份显示
    function updateMonthDisplay() {
        const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月',
                           '七月', '八月', '九月', '十月', '十一月', '十二月'];
        document.getElementById('currentMonth').textContent = 
            `${currentDate.getFullYear()}年 ${monthNames[currentDate.getMonth()]}`;
    }

    // 渲染日历
    function renderCalendar() {
        const daysGrid = document.getElementById('daysGrid');
        daysGrid.innerHTML = '';

        if (currentView === 'month') {
            renderMonthView(daysGrid);
        } else if (currentView === 'week') {
            renderWeekView(daysGrid);
        } else {
            renderDayView(daysGrid);
        }
    }

    // 创建日期元素
    function createDayElement(day) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        
        const dayNumber = document.createElement('div');
        dayNumber.classList.add('day-number');
        dayNumber.textContent = day;
        
        dayDiv.appendChild(dayNumber);
        return dayDiv;
    }

    // 添加事件监听器
    function attachEventListeners() {
        document.getElementById('prevMonth').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            updateMonthDisplay();
            renderCalendar();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            updateMonthDisplay();
            renderCalendar();
        });

        document.getElementById('addEvent').addEventListener('click', () => {
            document.getElementById('eventModal').style.display = 'flex';
        });

        document.getElementById('cancelEvent').addEventListener('click', () => {
            document.getElementById('eventModal').style.display = 'none';
        });

        document.getElementById('saveEvent').addEventListener('click', saveEvent);

        // 添加视图切换按钮的事件监听
        document.querySelectorAll('.view-button').forEach(button => {
            button.addEventListener('click', (e) => {
                document.querySelectorAll('.view-button').forEach(btn => 
                    btn.classList.remove('active'));
                e.target.classList.add('active');
                
                currentView = e.target.textContent === '月' ? 'month' : 
                             e.target.textContent === '周' ? 'week' : 'day';
                renderCalendar();
            });
        });
    }

    // 保存事件
    function saveEvent() {
        const title = document.getElementById('eventTitle').value;
        const dateTime = document.getElementById('eventDateTime').value;
        const description = document.getElementById('eventDescription').value;

        if (!title || !dateTime) {
            alert('请填写事件标题和时间！');
            return;
        }

        const dateString = dateTime.split('T')[0];
        if (!events[dateString]) {
            events[dateString] = [];
        }

        events[dateString].push({
            title,
            dateTime,
            description
        });

        localStorage.setItem('calendarEvents', JSON.stringify(events));
        document.getElementById('eventModal').style.display = 'none';
        renderCalendar();
    }

    // 辅助函数
    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    function isToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }

    // 添加新的渲染函数
    function renderMonthView(daysGrid) {
        // 将原来 renderCalendar 中的月视图代码移到这里
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const startPadding = firstDay.getDay();
        const totalDays = lastDay.getDate();

        // 添加上个月的填充日期
        for (let i = 0; i < startPadding; i++) {
            const dayDiv = createDayElement('');
            dayDiv.classList.add('padding');
            daysGrid.appendChild(dayDiv);
        }

        // 添加当月日期
        for (let day = 1; day <= totalDays; day++) {
            const dayDiv = createDayElement(day);
            const dateString = formatDate(new Date(currentDate.getFullYear(), 
                                                 currentDate.getMonth(), day));
            
            if (isToday(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))) {
                dayDiv.classList.add('today');
            }

            if (events[dateString]) {
                events[dateString].forEach(event => {
                    const eventElement = document.createElement('div');
                    eventElement.classList.add('event-marker');
                    eventElement.textContent = event.title;
                    dayDiv.appendChild(eventElement);
                });
            }

            daysGrid.appendChild(dayDiv);
        }
    }

    function renderWeekView(daysGrid) {
        daysGrid.classList.add('week-view');
        daysGrid.innerHTML = ''; // 清空原有内容

        // 创建周视图结构
        const weekHeader = document.createElement('div');
        weekHeader.className = 'week-header';
        
        // 添加空白格子用于对齐时间轴
        weekHeader.appendChild(createHeaderCell('', ''));

        // 获取当前周的起始日期
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay());

        // 渲染头部日期
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(weekStart.getDate() + i);
            const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
            const cell = createHeaderCell(dayNames[i], date.getDate());
            if (isToday(date)) {
                cell.querySelector('.week-day-number').classList.add('today');
            }
            weekHeader.appendChild(cell);
        }

        // 创建内容区域
        const weekContent = document.createElement('div');
        weekContent.className = 'week-content';

        // 添加时间轴
        const timeAxis = document.createElement('div');
        timeAxis.className = 'time-axis';
        for (let hour = 0; hour < 24; hour++) {
            const timeLabel = document.createElement('div');
            timeLabel.className = 'time-label';
            timeLabel.textContent = `${hour}:00`;
            timeAxis.appendChild(timeLabel);
        }
        weekContent.appendChild(timeAxis);

        // 创建时间格子
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(weekStart.getDate() + i);
            const dateString = formatDate(date);
            
            const hourColumn = document.createElement('div');
            hourColumn.className = 'hour-column';

            for (let hour = 0; hour < 24; hour++) {
                const hourSlot = document.createElement('div');
                hourSlot.className = 'hour-slot';

                // 添加事件
                if (events[dateString]) {
                    events[dateString].forEach(event => {
                        const eventHour = new Date(event.dateTime).getHours();
                        const eventMinute = new Date(event.dateTime).getMinutes();
                        if (eventHour === hour) {
                            const eventElement = document.createElement('div');
                            eventElement.className = 'event-marker';
                            eventElement.textContent = event.title;
                            eventElement.style.top = `${eventMinute}%`;
                            eventElement.style.height = '45px'; // 默认事件持续45分钟
                            
                            // 添加事件详情提示
                            eventElement.title = `${event.title}\n${event.description || ''}`;
                            
                            hourSlot.appendChild(eventElement);
                        }
                    });
                }

                hourColumn.appendChild(hourSlot);
            }
            weekContent.appendChild(hourColumn);
        }

        // 添加当前时间线
        const now = new Date();
        if (isCurrentWeek(weekStart)) {
            const currentTimeLine = document.createElement('div');
            currentTimeLine.className = 'current-time-line';
            const minutes = now.getHours() * 60 + now.getMinutes();
            currentTimeLine.style.top = `${(minutes / 1440) * 100}%`;
            weekContent.appendChild(currentTimeLine);
        }

        daysGrid.appendChild(weekHeader);
        daysGrid.appendChild(weekContent);

        // 滚动到当前时间附近
        const currentHour = now.getHours();
        weekContent.scrollTop = (currentHour - 1) * 60;
    }

    // 辅助函数
    function createHeaderCell(dayName, dayNumber) {
        const cell = document.createElement('div');
        cell.className = 'week-header-cell';
        
        const name = document.createElement('div');
        name.className = 'week-day-name';
        name.textContent = dayName;
        
        const number = document.createElement('div');
        number.className = 'week-day-number';
        number.textContent = dayNumber;
        
        cell.appendChild(name);
        cell.appendChild(number);
        return cell;
    }

    function isCurrentWeek(weekStart) {
        const now = new Date();
        const currentWeekStart = new Date(now);
        currentWeekStart.setDate(now.getDate() - now.getDay());
        return weekStart.getTime() === currentWeekStart.getTime();
    }

    // 初始化日历
    initCalendar();
}); 