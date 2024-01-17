(function($, window) {
        Chart.elements.Rectangle.prototype.draw = function() {//바그래프 라운드박스
        var ctx = this._chart.ctx;
        var vm = this._view;
        var left, right, top, bottom, signX, signY, borderSkipped, radius;
        var borderWidth = vm.borderWidth;
        var cornerRadius = this._chart.config.options.cornerRadius || 0;
        left = vm.x - vm.width / 2;
        right = vm.x + vm.width / 2;
        top = vm.y;
        bottom = vm.base;
        signX = 1;
        signY = bottom > top? 1: -1;
        borderSkipped = vm.borderSkipped || 'bottom';
        ctx.beginPath();
        ctx.fillStyle = vm.backgroundColor;
        ctx.strokeStyle = vm.borderColor;
        ctx.lineWidth = borderWidth;
        var corners = [
        [left, bottom],
        [left, top],
        [right, top],
        [right, bottom]
        ];
        function cornerAt(index) {
        return corners[index % 4];
        }
        var corner = cornerAt(0);
        ctx.moveTo(corner[0], corner[1]);
        for (var i = 1; i < 4; i++) {
        corner = cornerAt(i);
        nextCornerId = i+1;
        if(nextCornerId == 4){
                nextCornerId = 0
        }
        nextCorner = cornerAt(nextCornerId);
        width = corners[2][0] - corners[1][0];
        height = corners[0][1] - corners[1][1];
        x = corners[1][0];
        y = corners[1][1];
        var radius = cornerRadius;
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        }
        ctx.fill();
        if (borderWidth) {
        ctx.stroke();
        }
        };
})(jQuery, window);
