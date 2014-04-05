(function (angular) { 'use strict'

    angular.module('aeCalendar', ['ngLocale'])


        /**
         * @ngdoc provider
         * @name  aeCalendarProvider
         */
        .provider('aeCalendar', function () {

            /**
             * @ngdoc object
             * @name  aeCalendarProvider.config
             */
            this.config= {
                classes: {
                    calendar: 'calendar',
                    calendarCaption: 'calendar-caption',
                    calendarDayOfPrevMonth: 'prev',
                    calendarDayOfNextMonth: 'next',
                    calendarDayActive: 'active',
                    calendarDayValid: 'valid',
                    calendarDayBound: 'bound',
                },
                templateUrl: 'aeCalendar.tpl',
                week: [7,1,2,3,4,5,6], // ISO 8601
            }

            this.$get= function () { return {
                config: this.config,

                getMonth: function (date) {

                    var prevMonth= new Date(date.getFullYear(), date.getMonth()-1, 1)
                    var prevMonthLength= this.getMonthLength(prevMonth)

                    var month= new Date(date.getFullYear(), date.getMonth(), 1)
                    var monthLength= this.getMonthLength(month)

                    var nextMonth= new Date(date.getFullYear(), date.getMonth()+1, 1)
                    var nextMonthLength= this.getMonthLength(nextMonth)
                    var nextMonthStart= 1

                    var weeks= []

                    var week
                    var weekDay= this.config.week[month.getDay()]
                    var weekIndex= 0

                    var day= 1
                    var dayModel
                    for (var i= 0; i < 6; i++) {
                        var week= []
                        for (var j= 1; j < 8; j++) {
                            if (day <= monthLength && (weekIndex > 0 || j >= weekDay)) { // current month
                                dayModel= new Date(month.getFullYear(), month.getMonth(), day)
                                week.push(
                                    dayModel
                                )
                                day++
                            } else {
                                if (weekIndex == 0) { // prev month
                                    dayModel= new Date(month.getFullYear(), month.getMonth()-1, prevMonthLength-(weekDay-j-1))
                                    dayModel.isPrev= true
                                    week.push(
                                        dayModel
                                    )
                                } else { // next month
                                    dayModel= new Date(month.getFullYear(), month.getMonth()+1, nextMonthStart++)
                                    dayModel.isNext= true
                                    week.push(
                                        dayModel
                                    )
                                }
                            }
                        }
                        weekIndex++
                        weeks.push(week)
                    }
                    return weeks
                },



                getMonthLength: function (date) {
                    var monthLength= [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][date.getMonth()]
                    if (1 == date.getMonth()) { // а если високосный?
                        if ((date.getFullYear() % 4 == 0 && date.getFullYear() % 100 != 0) || date.getFullYear() % 400 == 0) {
                            monthLength= 29
                        }
                    }
                    return monthLength
                },



            }}
        })

        /**
         * @ngdoc directive
         * @name  aeCalendar
         */
        .directive('aeCalendar', function (aeCalendar, $locale) { return {

            restrict: 'EA',

            replace: true,
            templateUrl: aeCalendar.config.templateUrl,

            scope: {
                dateView: '=?',
                date: '=?',
                dateMin: '=?',
                dateMax: '=?',
            },

            controller: function ($scope) {

                $scope.$watch('dateView', function (date) {
                    if (!date) {
                        $scope.dateView= new Date()
                    } else {
                        $scope.aMonth= aeCalendar.getMonth(date)
                    }
                })

                var dateMin= null
                $scope.$watch('dateMin', function (date) {
                    dateMin= new Date(date.getFullYear(), date.getMonth(), date.getDate())
                })

                var dateMax= null
                $scope.$watch('dateMax', function (date) {
                    dateMax= new Date(date.getFullYear(), date.getMonth(), date.getDate())
                })

                $scope.prevMonth= function () {
                    $scope.dateView= new Date($scope.dateView)
                    $scope.dateView.setMonth(
                        $scope.dateView.getMonth() -1
                    )
                }

                $scope.nextMonth= function () {
                    $scope.dateView= new Date($scope.dateView)
                    $scope.dateView.setMonth(
                        $scope.dateView.getMonth() +1
                    )
                }

                $scope.getCalendarClass= function () {
                    return aeCalendar.config.classes.calendar
                }
                $scope.getCalendarCaptionClass= function () {
                    return aeCalendar.config.classes.calendarCaption
                }
                $scope.getDateClass= function (date) { var cls= {}
                    cls[aeCalendar.config.classes.calendarDayOfPrevMonth]= date.isPrev
                    cls[aeCalendar.config.classes.calendarDayOfNextMonth]= date.isNext
                    cls[aeCalendar.config.classes.calendarDayValid]= $scope.isValid(date)
                    cls[aeCalendar.config.classes.calendarDayBound]= $scope.isBound(date)
                    cls[aeCalendar.config.classes.calendarDayActive]= $scope.isActive(date)
                    return cls
                }

                $scope.isActive= function (date) {
                    if ($scope.date) {
                        return date.getTime() == $scope.date.getTime()
                    }
                }

                $scope.isValid= function (date) {
                    return $scope.isValidMin(date)
                        && $scope.isValidMax(date)
                }
                $scope.isValidMin= function (date) {
                    if (dateMin) {
                        return date.getTime() >= dateMin.getTime()
                    }
                    return true
                }
                $scope.isValidMax= function (date) {
                    if (dateMax) {
                        return date.getTime() <= dateMax.getTime()
                    }
                    return true
                }

                $scope.isBound= function (date) {
                    return $scope.isBoundMin(date)
                        || $scope.isBoundMax(date)
                }
                $scope.isBoundMin= function (date) {
                    if (dateMin) {
                        return date.getTime() == dateMin.getTime()
                    }
                }
                $scope.isBoundMax= function (date) {
                    if (dateMax) {
                        return date.getTime() == dateMax.getTime()
                    }
                }

                $scope.setDate= function (date) {
                    if (dateMin && date < dateMin) {
                        date= dateMin
                    }
                    if (dateMax && date > dateMax) {
                        date= dateMax
                    }
                    $scope.date= date
                }

            }

        }})

    ;



})(angular)
