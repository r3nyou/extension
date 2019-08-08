function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

$(function() {    
    const index = random(1, 6);
    $('body').css("background-image", "url('picture/" + index + ".jpg')");

    const titleArr = [
        '我看了甚麼? 你要去哪裡?',
        '多專注二分鐘，你的人生可以不一樣',
        'Without concentration, you have nothing',
        '答應我們，別再看些 543 的好嗎?',
        '不是說好要專注嗎?',
        '你到底在幹甚麼? 快找回專注力'
    ];
    $("#title").text(titleArr[index-1]);
});