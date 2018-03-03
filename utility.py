import json

# This function runs on all the paths we created in the web application.
# Basically every path becomes a rectangle which we"ll pass to the grab cut
# function.
# We later add up each grab cut to a final picture.
# @return array of rectangles in the format: x, y, width, height
def extractRectsFromPaths(json = "{\"paths\" : []}"):

    #FIXME
    # Currently loads a static JSON file, which can be generated with the
    # angular app.
    with open("data.json") as data_file:
        data = json.load(data_file)

    # Results stored in rects array.
    rects = [];
    for path in data["paths"]:
        # Use the first values as starting points.
        startX = path[0]["from"]["x"];
        startY = path[0]["from"]["y"];
        # Minimum values, otherwise we crash!
        width = 1;
        height = 1;
        for pathPoint in path:
            target = pathPoint["to"];
            # Check new X.
            if (startX > target["x"]):
                # New x is to the left of the starting point.
                # Use new X coordinate, expand rectangle width accordingly.
                width = width + (startX - target["x"]);
                startX = target["x"];
            else:
                # New x is to the right of/same as the starting point.
                if (startX + width < target["x"]):
                    # Currently the new X isn"t included. - Expand rectangle.
                    width = (target["x"] - startX);
                # If the new x is included in the current rectangle, do nothing.
            # Check new Y
            if (startY > target["y"]):
                # New y is above the starting point.
                # Use new y coordinate, expand rectangle height accordingly.
                height = height + (startY - target["y"]);
                startY = target["y"];
            else:
                # New y is below/same as the starting point.
                if (startY + height < target["y"]):
                    # Currently the new Y isn"t included. - Expand rectangle.
                    height = (target["y"] - startY);
                # If the new y is included in the current rectangle, do nothing.
        # Add result to rects array.
        rects.append((startX, startY, width, height));

    return rects;
