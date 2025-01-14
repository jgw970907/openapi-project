export const listTotalCount = (totalcount = 0) => {
    let notice = $("#list-total-count");
    if (notice.length > 0) {
        notice.text(`공고는 총 ${totalcount}개입니다.`);
    }
    else {
        notice = $("<p></p>")
            .attr("id", "list-total-count")
            .text(`공고는 총 ${totalcount}개입니다.`)
            .css({
            width: "300px",
            height: "50px",
            "line-height": "50px",
            "box-shadow": "0 0 10px rgba(0,0,0,0.8)",
            position: "relative",
            top: "0px",
            "background-color": "#f0f0f0",
            padding: "5px 10px",
            border: "1px solid #ccc",
            "border-radius": "5px",
            "text-align": "center",
            "font-size": "14px",
            "font-weight": "bold",
            color: "#333",
        });
        $(".contents").before(notice);
    }
};
//# sourceMappingURL=listTotalDisplay.js.map