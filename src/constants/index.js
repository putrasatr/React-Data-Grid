import moment from "moment";

export const BASE_API_URL = process.env.REACT_APP_BASE_API_URL
export const DRAG_DIRECTION_COLUMN = "column";

export const defaultDrageState = {
    column: -1,
    row: -1,
    startPoint: null,
    direction: "", // row=move up down/column=move left right,
    dropIndex: -1 // drag target
};

export const tabDays = [
    {
        title: "Harian",
        type: "daily",
        year: 0,
        month: 0,
        start_date: moment().format("YYYY-MM-DD"),
        end_date: moment().add(6, "days").format("YYYY-MM-DD")
    },
    {
        title: "Mingguan",
        type: "weekly",
        year: 0,
        month: Number(moment().month()) + 1,
        start_date: "",
        end_date: ""
    },
    {
        title: "Bulanan",
        type: "monthly",
        year: moment().year(),
        month: 0,
        start_date: "",
        end_date: ""
    }
]
export const initialStartDate = (n, type) => moment().subtract(n, type).format('YYYY-MM-DD');
export const initialEndDate = moment().format('YYYY-MM-DD');
export const selectOptionsDashboard = [
    { label: "30 Hari Terakhir", value: "30", start_date: initialStartDate(1, "months"), end_date: initialEndDate },
    { label: "7 Hari Terakhir", value: "7", start_date: initialStartDate(7, "days"), end_date: initialEndDate },
    { label: "3 Hari Terakhir", value: "3", start_date: initialStartDate(3, "days"), end_date: initialEndDate },
    { label: "Kemarin", value: "1", start_date: initialStartDate(1, "days"), end_date: initialEndDate }
]
export const validationInit = {
    username: {
        isInvalid: false,
        msg: ""
    },
    password: {
        isInvalid: false,
        msg: ""
    }
}

export const arrRekapReseller =[
    {
        "title": "Total Reseller",
        "total": 0
    },
    {
        "title": "Total Reseller Baru",
        "total": 0
    },
    {
        "title": "Total Deposit Agen",
        "total": 0
    },
    {
        "title": "Total Komisi",
        "total": 0
    }
] 
export const  arrRekapPenjualan = [
    { title: "Kemarin", total: 12000000000 },
    { title: "3 Hari", total: 12000000000 },
    { title: "7 Hari", total: 12000000000 },
    { title: "30 Hari", total: 12000000000 }
]