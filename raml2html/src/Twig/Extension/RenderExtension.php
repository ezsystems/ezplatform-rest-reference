<?php

declare(strict_types=1);

namespace EzSystems\Raml2Html\Twig\Extension;

use Raml\Method;
use Raml\TypeCollection;
use Raml\TypeInterface;
use Raml\Types\ArrayType;
use Raml\Types\LazyProxyType;
use Raml\Types\ObjectType;
use Ramsey\Uuid\Uuid;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;
use Twig\TwigTest;

class RenderExtension extends AbstractExtension
{
    public function getFunctions(): array
    {
        return [
            new TwigFunction('uuid', function () {
                return Uuid::uuid1()->toString();
            }),
            new TwigFunction('dump', function ($var, ...$moreVars) {
                ob_start();
                dump($var, ...$moreVars);
                $output = ob_get_contents();
                ob_end_flush();

                return $output;
            }),
            new TwigFunction('schema_format', function (string $mediaType) {
                return explode('+', $mediaType)[1] ?? '';
            }),
            new TwigFunction('method_types', function (TypeCollection $typeCollection, Method $method) {
                $types = [];
                $methodTypes = $this->getTypes($method);

                foreach ($methodTypes as $type) {
                    $types[$type] = $typeCollection->getTypeByName($type)->getDefinition()['description'] ?? '';
                }

                return $types;
            }),
            new TwigFunction('method_name_id', [$this, 'prepareMethodNameId'])
        ];
    }

    public function prepareMethodNameId(string $methodName): string
    {
        $methodName = strtolower($methodName);
        $methodNameNoWhitespaces = preg_replace('/[\s\/]/', '-', $methodName);

        return preg_replace('/[()]/', '', $methodNameNoWhitespaces);
    }

    public function getTests(): array
    {
        return [
            new TwigTest('scalar type', function ($type) {
                return $this->isScalarType($type);
            }),
            new TwigTest('array type', function (TypeInterface $type) {
                return $this->isArrayType($type);
            }),
            new TwigTest('object type', function (TypeInterface $type) {
                return $this->isObjectType($type);
            }),
            new TwigTest('standard type', function ($type) {
                return $this->isStandardType((string)$type);
            }),
        ];
    }

    private function isScalarType($type): bool
    {
        if ($type instanceof TypeInterface) {
            $type = $type->getName();
        }

        return in_array($type, [
            'time-only',
            'datetime',
            'datetime-only',
            'date-only',
            'number',
            'boolean',
            'string',
            'null',
            'nil',
            'file',
            'integer',
        ]);
    }

    private function isArrayType(TypeInterface $type): bool
    {
        return $type instanceof ArrayType;
    }

    private function isObjectType(TypeInterface $type): bool
    {
        if ($type instanceof LazyProxyType) {
            $type = $type->getWrappedObject();
        }

        return $type instanceof ObjectType;
    }

    private function isStandardType($type): bool
    {
        if ($type instanceof TypeInterface) {
            $type = $type->getName();
        }

        return $this->isScalarType($type) || $type === 'object';
    }


    private function getTypes(Method $method)
    {
        $requestTypes = $this->getTypesFromBodies($method->getBodies());

        foreach ($method->getResponses() as $response) {
            $requestTypes += array_merge($requestTypes, $this->getTypesFromBodies($response->getBodies()));
        }

        return array_unique($requestTypes);
    }

    /**
     * @param \Raml\BodyInterface[] $bodies
     *
     * @return array
     */
    private function getTypesFromBodies(array $bodies): array
    {
        $types = [];

        foreach ($bodies as $body) {
            $types[] = $body->getType()->getName();
        }

        return $types;
    }
}
