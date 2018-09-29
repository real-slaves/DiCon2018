class Util
{
    static distance()
    {
        if (arguments.length == 4)
            return Math.sqrt(Math.pow(arguments[0] - arguments[2], 2) + Math.pow(arguments[1] - arguments[3], 2));
        else if (arguments.length == 2)
            return Math.sqrt(Math.pow(arguments[0].x - arguments[1].x, 2) + Math.pow(arguments[0].y - arguments[1].y, 2));
    }

    static doubleDistance()
    {
        if (arguments.length == 4)
            return Math.pow(arguments[0] - arguments[2], 2) + Math.pow(arguments[1] - arguments[3], 2);
        else if (arguments.length == 2)
            return Math.pow(arguments[0].x - arguments[1].x, 2) + Math.pow(arguments[0].y - arguments[1].y, 2);
    }
}