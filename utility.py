import json
import Image
import matlab.engine
import numpy as np

# This function runs on all the paths we created in the web application.
# Basically every path becomes a rectangle which we"ll pass to the grab cut
# function.
# We later add up each grab cut to a final picture.
# @return array of rectangles in the format: x, y, width, height

def extractFromPaths(data, img):
    # Results stored in an array.
    shape = img.shape
    height = shape[0]
    width = shape[1]
    tmp = [[],[]]
    fore = np.array([])
    back = np.array([])
    for path in data["fore"]:
        for i in range(0, len(path)):
            X = path[i]["cor"]["x"];
            Y = path[i]["cor"]["y"];
            # Minimum values, otherwise we crash!
            tmp[0].append(int(X*height+Y))
    for path in data["back"]:
        for i in range(0, len(path)):
            X = path[i]["cor"]["x"];
            Y = path[i]["cor"]["y"];
            # Minimum values, otherwise we crash!
            tmp[1].append(int(X*height+Y))

    fore = matlab.int32(tmp[0])
    fore = fore[0]
    back = matlab.int32(tmp[1])
    back = back[0]
    ans = [fore, back]
    return ans;
